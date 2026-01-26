import { queryMany } from '../utils/db-client';
import { log } from '../utils';
import commandLogger from '../utils/commandLogger';

interface Context {
  message: {
    reply_to_message?: {
      from: {
        id: number;
        username?: string;
        first_name?: string;
        last_name?: string;
      };
    };
    text: string;
    entities: Array<{ length: number }>;
    chat: { id: number };
  };
  from: {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  deleteMessage: () => Promise<any>;
  telegram: {
    getChatMember: (chatId: string, userId: number) => Promise<any>;
    kickChatMember: (chatId: string, userId: number) => Promise<any>;
    sendMessage: (chatId: string, text: string, options?: any) => Promise<any>;
  };
}

/**
 * Generate ban notification message
 */
function generateBanMessage(ctx: Context, args: string): string {
  if (!ctx.message.reply_to_message) return '';

  const { username, first_name, last_name, id: userId } = ctx.message.reply_to_message.from;
  const banned = `[${first_name || last_name || username}](tg://user?id=${userId})`;
  const admin = `[${ctx.from.first_name || ctx.from.last_name || ctx.from.username}](tg://user?id=${ctx.from.id})`;

  return `*${userId}* *BAN*  🔨  🛫 \n\n*Banlanan Kişi*: ${banned}\n*Banlayan Admin*: ${admin}\n*Sebep*: ${args || 'Belirtilmemiş'}`;
}

/**
 * Fetch all active telegram groups from database
 */
async function fetchActiveGroups(): Promise<Array<{ channelId: string }>> {
  try {
    const groups = await queryMany<{ channel_id: string | null }>(
      `SELECT channel_id FROM telegram_groups WHERE active = true AND channel_id IS NOT NULL`
    );
    return groups
      .filter((g) => g.channel_id !== null)
      .map((g) => ({ channelId: g.channel_id! }));
  } catch (error) {
    console.error('Error fetching active groups:', error);
    throw error;
  }
}

/**
 * Main command handler for /ban
 */
async function banCommand(ctx: Context): Promise<void> {
  try {
    await ctx.deleteMessage();

    const args = ctx.message.text.slice(ctx.message.entities[0].length + 1);

    if (!ctx.message.reply_to_message) {
      console.log('Ban Error: No reply_to_message');
      return;
    }

    const userId = ctx.message.reply_to_message.from.id;

    // Check if user to be banned is not an admin
    const toBeBanned = await ctx.telegram.getChatMember(
      process.env.ADMIN_CH_ID!,
      userId
    );

    const isToBeBannedNotAdmin = !toBeBanned || (toBeBanned.status === 'kicked' || toBeBanned.status === 'left');

    if (isToBeBannedNotAdmin) {
      // Fetch all active groups from database
      const groups = await fetchActiveGroups();

      // Ban user from all groups
      await Promise.all(groups.map(async (group: { channelId: string }) => {
        try {
          await ctx.telegram.kickChatMember(group.channelId, userId);
        } catch (error) {
          console.error(`Error kicking user from ${group.channelId}:`, error);
        }
      }));

      // Send notification to admin channel
      await ctx.telegram.sendMessage(
        process.env.ADMIN_CH_ID!,
        generateBanMessage(ctx, args),
        {
          parse_mode: 'Markdown',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: 'Geri Al',
                  callback_data: `unban: ${userId}`
                }
              ]
            ]
          }
        }
      );

      await log(ctx as any, 'ban');
      commandLogger.logCommand(ctx as any, 'ban', true);
    } else {
      console.log('Ban Error: Yetkisiz İşlem / Hatalı Kullanım');
    }
  } catch (err) {
    console.log('Ban Error: Hata aşağıdadır.');
    console.error(err);
    commandLogger.logError(ctx as any, 'ban', err as Error);
  }
}

export default banCommand;
