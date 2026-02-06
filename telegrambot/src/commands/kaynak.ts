import { query, queryMany } from '../utils/db-client';
import { parse } from 'node-html-parser';
import errorMessage from '../utils/errorMessage';
import commandLogger from '../utils/commandLogger';

interface Context {
  message: {
    chat: { id: number; title?: string; type: string };
    from: { id: number; username?: string; first_name?: string };
    message_id: number;
    entities?: Array<{ type: string; offset: number; length: number }>;
    text: string;
  };
  reply: (text: string, options?: any) => Promise<any>;
  telegram: {
    editMessageText: (chatId: number, messageId: number, inlineMessageId: any, text: string) => Promise<any>;
    getChat: (chatId: number) => Promise<{ title?: string; username?: string }>;
  };
  from: {
    id: number;
    username?: string;
    first_name?: string;
  };
}

interface SourceData {
  url: string;
  title?: string;
  description?: string;
  hashtags: string[];
  groupName: string;
  tgChannel: number;
  tgUser: number;
  tgUsername?: string;
}

interface ParsedMessage {
  urls: string[];
  hashtags: string[];
  description: string;
}

/**
 * Parse message to extract URLs, hashtags, and description
 */
function parseMessage(text: string, entities?: Array<{ type: string; offset: number; length: number }>): ParsedMessage {
  const urls: string[] = [];
  const hashtags: string[] = [];
  let description = text;

  if (!entities) {
    return { urls, hashtags, description: description.trim() };
  }

  // Sort entities by offset in reverse order for safe removal
  const sortedEntities = [...entities].sort((a, b) => b.offset - a.offset);

  // First pass: collect URLs and hashtags
  entities.forEach(entity => {
    if (entity.type === 'url') {
      const link = text.slice(entity.offset, entity.offset + entity.length);
      const linkWithHttp = link.startsWith('http://') || link.startsWith('https://')
        ? link
        : 'http://' + link;
      urls.push(linkWithHttp);
    } else if (entity.type === 'hashtag') {
      const hashtag = text.slice(entity.offset, entity.offset + entity.length);
      // Remove # and store lowercase
      hashtags.push(hashtag.slice(1).toLowerCase());
    }
  });

  // Second pass: remove URLs and hashtags from description
  sortedEntities.forEach(entity => {
    if (entity.type === 'url' || entity.type === 'hashtag') {
      description = description.slice(0, entity.offset) + description.slice(entity.offset + entity.length);
    }
  });

  // Remove command prefix if present
  description = description.replace(/^[!/]kaynak\s*/i, '');

  // Clean up extra whitespace
  description = description.replace(/\s+/g, ' ').trim();

  return { urls, hashtags, description };
}

/**
 * Fetch headers for a URL using native fetch
 */
async function fetchUrlHeaders(url: string): Promise<Headers | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.headers;
  } catch (error) {
    console.error(`Error fetching headers for ${url}:`, error);
    return null;
  }
}

/**
 * Extract title from URL
 */
async function extractTitle(url: string, headers: Headers | null): Promise<string> {
  try {
    const contentType = headers?.get('content-type');

    if (contentType?.includes('text/html')) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const html = await response.text();
      const titleElement = parse(html).querySelector('title');
      return titleElement?.text || url;
    } else {
      // Try to extract filename from content-disposition header
      const contentDisposition = headers?.get('content-disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          return match[1];
        }
      }
      return url;
    }
  } catch (error) {
    console.error(`Error extracting title for ${url}:`, error);
    return url;
  }
}

/**
 * Get or create tags in database
 */
async function getOrCreateTags(hashtags: string[]): Promise<number[]> {
  if (hashtags.length === 0) return [];

  const tagIds: number[] = [];

  for (const name of hashtags) {
    try {
      // Try to find existing tag
      const existing = await queryMany<{ id: number }>(
        `SELECT id FROM tags WHERE LOWER(name) = LOWER($1)`,
        [name]
      );

      if (existing.length > 0) {
        tagIds.push(existing[0].id);
      } else {
        // Create new tag
        const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const result = await query(
          `INSERT INTO tags (name, slug, "createdAt", "updatedAt")
           VALUES ($1, $2, NOW(), NOW())
           ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [name, slug]
        );
        if (result.rows[0]) {
          tagIds.push(result.rows[0].id);
        }
      }
    } catch (error) {
      console.error(`Error creating tag ${name}:`, error);
    }
  }

  return tagIds;
}

/**
 * Save source to database with tags
 */
async function saveSourceToDatabase(source: SourceData, tagIds: number[]): Promise<number | null> {
  try {
    // Insert source
    const result = await query(
      `INSERT INTO sources (title, description, url, "groupName", "tgChannel", "tgUser", "tgUsername", approved, active, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       ON CONFLICT (title) DO NOTHING
       RETURNING id`,
      [
        source.title || source.url,
        source.description || null,
        source.url,
        source.groupName,
        source.tgChannel.toString(),
        source.tgUser.toString(),
        source.tgUsername || null,
        false,
        true
      ]
    );

    if (!result.rows[0]) {
      // Source already exists
      return null;
    }

    const sourceId = result.rows[0].id;

    // Connect tags to source via junction table
    if (tagIds.length > 0) {
      for (const tagId of tagIds) {
        await query(
          `INSERT INTO "_SourceTags" ("A", "B")
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [sourceId, tagId]
        );
      }
    }

    return sourceId;
  } catch (error) {
    console.error('Error saving source to database:', error);
    throw error;
  }
}

/**
 * Main command handler for /kaynak
 */
async function kaynakCommand(ctx: Context): Promise<void> {
  let message: any;

  try {
    // Parse message to extract URLs, hashtags, and description
    const { urls, hashtags, description } = parseMessage(ctx.message.text, ctx.message.entities);

    if (urls.length === 0) {
      await ctx.reply(
        '📚 *Kaynak Ekleme*\n\n' +
        'Kullanım: `/kaynak <link> [açıklama] [#etiketler]`\n\n' +
        'Örnek:\n' +
        '`/kaynak https://react.dev React dokümantasyonu #react #frontend`',
        { parse_mode: 'Markdown' }
      );
      return;
    }

    // Send processing message
    message = await ctx.reply('⏳ Kaynak ekleniyor...', {
      reply_to_message_id: ctx.message.message_id
    });

    // Get group name
    let groupName = ctx.message.chat.title || 'Bilinmeyen Grup';
    if (ctx.message.chat.type === 'private') {
      groupName = 'Özel Mesaj';
    } else {
      try {
        const chatInfo = await ctx.telegram.getChat(ctx.message.chat.id);
        groupName = chatInfo.title || chatInfo.username || groupName;
      } catch (e) {
        // Use fallback
      }
    }

    // Get or create tags
    const tagIds = await getOrCreateTags(hashtags);

    // Process each URL
    const results: { url: string; success: boolean; reason?: string }[] = [];

    for (const url of urls) {
      const headers = await fetchUrlHeaders(url);
      const title = headers ? await extractTitle(url, headers) : url;

      const sourceData: SourceData = {
        url,
        title,
        description: description || undefined,
        hashtags,
        groupName,
        tgChannel: ctx.message.chat.id,
        tgUser: ctx.message.from.id,
        tgUsername: ctx.from?.username
      };

      const sourceId = await saveSourceToDatabase(sourceData, tagIds);

      if (sourceId) {
        results.push({ url, success: true });
      } else {
        results.push({ url, success: false, reason: 'Bu kaynak zaten mevcut' });
      }
    }

    // Build response message
    const successCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    let responseText = '';
    if (successCount > 0) {
      responseText = `✅ ${successCount} kaynak başarıyla eklendi!\n\n`;
      responseText += '📋 Admin onayından sonra sitede görünecektir.';
    }
    if (failedCount > 0) {
      if (responseText) responseText += '\n\n';
      responseText += `⚠️ ${failedCount} kaynak eklenemedi:\n`;
      results.filter(r => !r.success).forEach(r => {
        responseText += `• ${r.url.substring(0, 30)}... - ${r.reason}\n`;
      });
    }

    if (hashtags.length > 0) {
      responseText += `\n\n🏷️ Etiketler: ${hashtags.map(h => `#${h}`).join(' ')}`;
    }

    // Update message with result
    await ctx.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      responseText
    );

    commandLogger.logCommand(ctx as any, 'kaynak', true);
  } catch (err) {
    console.error('Kaynak command error:', err);
    commandLogger.logError(ctx as any, 'kaynak', err as Error);

    if (message) {
      await ctx.telegram.editMessageText(
        message.chat.id,
        message.message_id,
        undefined,
        `${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`
      );
    } else {
      await ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
    }
  }
}

export default kaynakCommand;
