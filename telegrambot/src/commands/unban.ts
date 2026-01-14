import { prisma } from '../utils/prisma-client';
import { log } from '../utils';
import commandLogger from '../utils/commandLogger';

interface Context {
  message: {
    reply_to_message?: {
      text: string;
    };
    chat: { id: number };
  };
  from: {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  telegram: {
    unbanChatMember: (chatId: string, userId: number) => Promise<any>;
    sendMessage: (chatId: string, text: string, options?: any) => Promise<any>;
  };
}

/**
 * Generate unban notification message
 */
function generateUnbanMessage(ctx: Context, userId: string): string {
  const unbanned = `[${userId}](tg://user?id=${userId})`;
  const admin = `[${ctx.from.first_name || ctx.from.last_name || ctx.from.username}](tg://user?id=${ctx.from.id})`;

  return `*${userId}* *UNBAN*  ◀️  🛬\n\n*Banı Açılan Kişi*: ${unbanned}\n*İşlemi Gerçekleştiren Admin*: ${admin}`;
}

/**
 * Fetch all active telegram groups from database
 */
async function fetchActiveGroups(): Promise<Array<{ channelId: string }>> {
  try {
    const groups = await prisma.telegramGroup.findMany({
      where: {
        active: true,
        channelId: {
          not: null
        }
      },
      select: {
        channelId: true
      }
    });
    return groups.filter((g: { channelId: string | null }) => g.channelId !== null) as Array<{ channelId: string }>;
  } catch (error) {
    console.error('Error fetching active groups:', error);
    throw error;
  }
}

/**
 * Main command handler for /unban
 */
async function unbanCommand(ctx: Context, id?: string): Promise<void> {
  try {
    const isAdminChannel = ctx.message.chat.id.toString() === process.env.ADMIN_CH_ID;
    const hasReplyMessage = ctx.message.reply_to_message;

    if (id || (isAdminChannel && hasReplyMessage)) {
      // Fetch all active groups from database
      const groups = await fetchActiveGroups();

      // Extract user ID from parameter or reply message
      const userId = id || ctx.message.reply_to_message!.text.split(' ')[0];

      // Unban user from all groups
      await Promise.all(groups.map(async (group: { channelId: string }) => {
        try {
          await ctx.telegram.unbanChatMember(group.channelId, parseInt(userId));
        } catch (error) {
          console.error(`Error unbanning user from ${group.channelId}:`, error);
        }
      }));

      // Send notification to admin channel
      await ctx.telegram.sendMessage(
        process.env.ADMIN_CH_ID!,
        generateUnbanMessage(ctx, userId),
        { parse_mode: 'Markdown' }
      );

      await log(ctx as any, { type: 'unban', userId: parseInt(userId) });
      commandLogger.logCommand(ctx as any, 'unban', true);
    } else {
      console.log('Unban Error: Yetkisiz İşlem / Hatalı Kullanım');
    }
  } catch (err) {
    console.log('Unban Error: Yetkisiz İşlem');
    console.error(err);
    commandLogger.logError(ctx as any, 'unban', err as Error);
  }
}

export default unbanCommand;
