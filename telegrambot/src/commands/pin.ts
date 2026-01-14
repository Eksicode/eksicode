import { prisma } from '../utils/prisma-client';
import * as fs from 'fs';
import commandLogger from '../utils/commandLogger';

interface Context {
  message: {
    text: string;
  };
  telegram: {
    sendMessage: (chatId: string, text: string, options?: any) => Promise<any>;
    pinChatMessage: (chatId: string, messageId: number, options?: any) => Promise<any>;
  };
  from: {
    id: number;
    username?: string;
    first_name?: string;
  };
}

/**
 * Read .pinignore file to get excluded channels
 */
function readPinIgnore(): string[] {
  try {
    const content = fs.readFileSync('.pinignore', 'utf-8');
    return content.split(/\r?\n/).filter(line => line.trim().length > 0);
  } catch (error) {
    console.error('Error reading .pinignore:', error);
    return [];
  }
}

/**
 * Fetch all active telegram groups from database
 */
async function fetchActiveGroups(): Promise<Array<{ channelId: string; name: string }>> {
  try {
    const groups = await prisma.telegramGroup.findMany({
      where: {
        active: true,
        channelId: {
          not: null
        }
      },
      select: {
        channelId: true,
        name: true
      }
    });
    return groups.filter((g: { channelId: string | null; name: string }) => g.channelId !== null) as Array<{ channelId: string; name: string }>;
  } catch (error) {
    console.error('Error fetching active groups:', error);
    throw error;
  }
}

/**
 * Main command handler for /pin
 */
async function pinCommand(ctx: Context): Promise<void> {
  try {
    // Extract message to pin (everything after the command)
    const args = ctx.message.text.slice(ctx.message.text.split(' ')[0].length);

    if (!args || args.trim().length === 0) {
      console.log('Pin Error: No message provided');
      return;
    }

    // Read exceptions from .pinignore
    const exceptions = readPinIgnore();

    // Fetch all active groups from database
    const groups = await fetchActiveGroups();

    // Send and pin message to all groups (except ignored ones)
    await Promise.all(groups.map(async (group: { channelId: string; name: string }) => {
      try {
        if (exceptions.includes(group.channelId)) {
          console.log(`${group.name} kanalına .pinignore dosyası sebebiyle gönderilmeyecektir.`);
          return;
        }

        const message = await ctx.telegram.sendMessage(group.channelId, args, {
          disable_notification: true
        });

        await ctx.telegram.pinChatMessage(
          group.channelId,
          message.message_id,
          { disable_notification: true }
        );
      } catch (error) {
        console.error(`Error pinning message to ${group.name}:`, error);
      }
    }));

    commandLogger.logCommand(ctx as any, 'pin', true);
  } catch (err) {
    console.error('Pin command error:', err);
    commandLogger.logError(ctx as any, 'pin', err as Error);
  }
}

export default pinCommand;
