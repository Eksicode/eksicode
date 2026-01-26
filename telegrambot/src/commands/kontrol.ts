import { query, queryMany } from '../utils/db-client';
import errorMessage from '../utils/errorMessage';
import commandLogger from '../utils/commandLogger';

interface Context {
  message: {
    text: string;
    entities: Array<{ length: number }>;
  };
  reply: (text: string) => Promise<any>;
  replyWithMarkdown: (text: string) => Promise<any>;
  from: {
    id: number;
    username?: string;
    first_name?: string;
  };
}

interface Source {
  id: number;
  title: string;
  url: string;
  approved: boolean;
}

/**
 * Fetch all unapproved sources from the database
 */
async function fetchUnapprovedSources(): Promise<Source[]> {
  try {
    const sources = await queryMany<{
      id: number;
      title: string;
      url: string;
      approved: boolean;
    }>(
      `SELECT id, title, url, approved 
       FROM sources 
       WHERE approved = false AND active = true 
       ORDER BY created_at DESC`
    );
    return sources;
  } catch (error) {
    console.error('Error fetching unapproved sources:', error);
    throw error;
  }
}

/**
 * Parse sources into a formatted markdown string
 */
function parseResources(sources: Source[]): string {
  if (sources.length > 0) {
    return sources.map(e => `*${e.id}:* [${e.title}](${e.url})`).join('\n');
  } else {
    return '*Tüm kaynaklar onaylandı.*';
  }
}

/**
 * Approve or delete sources based on the provided IDs
 * IDs starting with '!' will be deleted, others will be approved
 */
async function processResources(ids: string[]): Promise<void> {
  try {
    // Separate approve and delete operations
    const toApprove: number[] = [];
    const toDelete: number[] = [];

    ids.forEach(id => {
      if (id.startsWith('!')) {
        const numericId = parseInt(id.slice(1));
        if (!isNaN(numericId)) {
          toDelete.push(numericId);
        }
      } else {
        const numericId = parseInt(id);
        if (!isNaN(numericId)) {
          toApprove.push(numericId);
        }
      }
    });

    // Execute operations in parallel
    await Promise.all([
      // Approve sources
      toApprove.length > 0 ? query(
        `UPDATE sources SET approved = true WHERE id = ANY($1::int[])`,
        [toApprove]
      ) : Promise.resolve(),
      
      // Delete sources
      toDelete.length > 0 ? query(
        `DELETE FROM sources WHERE id = ANY($1::int[])`,
        [toDelete]
      ) : Promise.resolve()
    ]);

    console.log(`Approved ${toApprove.length} sources, deleted ${toDelete.length} sources`);
  } catch (error) {
    console.error('Error processing resources:', error);
    throw error;
  }
}

/**
 * Main command handler for /kontrol
 * Lists unapproved sources or processes approval/deletion based on arguments
 */
async function kontrolCommand(ctx: Context): Promise<void> {
  try {
    // Extract arguments from the command
    const args = ctx.message.text.slice(ctx.message.entities[0].length + 1).trim();

    if (args) {
      // Process the sources (approve or delete)
      const ids = args.split(/\s+/).filter(id => id.length > 0);
      
      if (ids.length === 0) {
        await ctx.reply('❌ Geçersiz kaynak numaraları.');
        return;
      }

      await processResources(ids);
      await ctx.reply('✅ İşlem başarılı!');
      commandLogger.logCommand(ctx as any, 'kontrol_process', true);
    } else {
      // List unapproved sources
      const sources = await fetchUnapprovedSources();
      const parsed = parseResources(sources);
      
      await ctx.replyWithMarkdown(
        `*Onaylanmamış Kaynaklar:*\n\n${parsed}\n\n` +
        `*Kaynakları onaylamak için:* /kontrol <kaynak-numaralarını-boşlukla-ayır>\n` +
        `*Kaynakları silmek için:* /kontrol !<kaynak-numarası>`
      );
      commandLogger.logCommand(ctx as any, 'kontrol_list', true);
    }
  } catch (err) {
    console.error('Kontrol command error:', err);
    commandLogger.logError(ctx as any, 'kontrol', err as Error);
    await ctx.reply(errorMessage() + ' Bir hata oluştu. Lütfen tekrar deneyiniz.');
  }
}

export default kontrolCommand;
