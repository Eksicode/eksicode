import { query } from '../utils/db-client';
import { parse } from 'node-html-parser';
import errorMessage from '../utils/errorMessage';
import commandLogger from '../utils/commandLogger';

interface Context {
  message: {
    chat: { id: number };
    from: { id: number };
    message_id: number;
    entities?: Array<{ type: string; offset: number; length: number }>;
    text: string;
  };
  reply: (text: string, options?: any) => Promise<any>;
  telegram: {
    editMessageText: (chatId: number, messageId: number, inlineMessageId: any, text: string) => Promise<any>;
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
  headers?: Headers | null;
  tgChannel: number;
  tgUser: number;
}

/**
 * Extract URLs from message entities
 */
function extractUrlsFromMessage(text: string, entities?: Array<{ type: string; offset: number; length: number }>): string[] {
  const urls: string[] = [];

  if (!entities) return urls;

  entities.forEach(entity => {
    if (entity.type === 'url') {
      const link = text.slice(entity.offset, entity.offset + entity.length);
      const linkWithHttp = link.startsWith('http://') || link.startsWith('https://')
        ? link
        : 'http://' + link;
      urls.push(linkWithHttp);
    }
  });

  return urls;
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
 * Save sources to database
 */
async function saveSourcesToDatabase(sources: SourceData[]): Promise<void> {
  try {
    await Promise.all(sources.map(async source => {
      await query(
        `INSERT INTO sources (title, url, "tgChannel", "tgUser", approved, active)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          source.title || source.url,
          source.url,
          source.tgChannel.toString(),
          source.tgUser.toString(),
          false,
          true
        ]
      );
    }));
  } catch (error) {
    console.error('Error saving sources to database:', error);
    throw error;
  }
}

/**
 * Main command handler for !kaynak
 */
async function kaynakCommand(ctx: Context): Promise<void> {
  let message: any;

  try {
    // Extract URLs from message
    const urls = extractUrlsFromMessage(ctx.message.text, ctx.message.entities);

    if (urls.length === 0) {
      await ctx.reply('Kullanım: !kaynak <link(ler) içeren mesaj>');
      return;
    }

    // Send processing message
    message = await ctx.reply('Kaynak ekleniyor...', {
      reply_to_message_id: ctx.message.message_id
    });

    // Process each URL
    const sources: SourceData[] = [];

    for (const url of urls) {
      const headers = await fetchUrlHeaders(url);
      const title = headers ? await extractTitle(url, headers) : url;

      sources.push({
        url,
        title,
        headers,
        tgChannel: ctx.message.chat.id,
        tgUser: ctx.message.from.id
      });
    }

    // Save to database
    await saveSourcesToDatabase(sources);

    // Update message with success
    await ctx.telegram.editMessageText(
      message.chat.id,
      message.message_id,
      undefined,
      'Teşekkürler! Kaynaklar başarıyla eklendi.'
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
