import { queryMany } from '../utils/db-client';
import errorMessage from '../utils/errorMessage';
import commandLogger from '../utils/commandLogger';

interface Context {
  message: {
    text: string;
  };
  reply: (text: string) => Promise<any>;
  replyWithMarkdown: (text: string) => Promise<any>;
  from: {
    id: number;
    username?: string;
    first_name?: string;
  };
}

interface TelegramGroup {
  id: number;
  name: string;
  link: string;
}

/**
 * Fetch telegram groups from database with optional search filter
 */
async function fetchGroups(query: string): Promise<TelegramGroup[]> {
  try {
    let sql = `SELECT id, name, link FROM telegram_groups WHERE active = true`;
    const params: any[] = [];
    
    if (query) {
      sql += ` AND LOWER(name) LIKE LOWER($1)`;
      params.push(`%${query}%`);
    }
    
    sql += ` ORDER BY name ASC`;
    
    const groups = await queryMany<{ id: number; name: string; link: string }>(sql, params);
    return groups;
  } catch (error) {
    console.error('Error fetching groups:', error);
    throw error;
  }
}

/**
 * Format groups into markdown list
 */
function formatGroupsResponse(groups: TelegramGroup[]): string {
  if (groups.length > 0) {
    const groupList = groups.map(g => `- [${g.name}](${g.link})`).join('\n');
    return `*Sonuçlar:*\n\n${groupList}`;
  } else {
    return `${errorMessage()} Sonuç bulunamadı. 😕`;
  }
}

/**
 * Main command handler for !grup / !kanal
 */
async function groupCommand(ctx: Context): Promise<void> {
  try {
    // Extract arguments (everything after the command)
    const args = ctx.message.text.slice(ctx.message.text.split(' ')[0].length + 1).trim();

    if (!args) {
      await ctx.reply('Kullanım: !grup <sorgu|tümü|*>');
      return;
    }

    // Determine search query
    const query = ['tümü', '*'].includes(args) ? '' : args;

    // Fetch groups from database
    const groups = await fetchGroups(query);

    // Format and send response
    const response = formatGroupsResponse(groups);
    await ctx.replyWithMarkdown(response);

    commandLogger.logCommand(ctx as any, 'group', true);
  } catch (err) {
    console.error('Group command error:', err);
    commandLogger.logError(ctx as any, 'group', err as Error);
    await ctx.reply(`${errorMessage()} Bir hata oluştu. Lütfen daha sonra tekrar deneyin.`);
  }
}

export default groupCommand;
