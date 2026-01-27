/**
 * Text handler with queue support
 */

import * as cmd from '../commands';
import { forAdmins } from '../utils';
import easterEggHandler from './easterEggHandler';
import { addCommandJob } from '../queues';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commands: Record<string, (ctx: any) => Promise<void> | void> = {
  '!kaynak': cmd.SourceBot,
  '!grup': cmd.GroupBot,
  '!yardim': cmd.helpCommand,
  '!help': cmd.helpCommand,
  '!discord': cmd.discordCommand,
  '!duyuru': cmd.announcementCommand,
  '!youtube': cmd.youtubeCommand,
  '!twitter': cmd.twitterCommand,
  '!github': cmd.githubCommand,
  '!report': cmd.reportCommand,
  '!hastebinize': cmd.hastebinizeCommand,
  '!stats': cmd.statsCommand,
  '!istatistik': cmd.statsCommand
};

const adminOnly = ['!hastebinize'];

const enableQueue = process.env.ENABLE_QUEUE === 'true';

async function textHandler(ctx: any): Promise<void> {
  const message = ctx.message.text;
  const command = message.split(' ')[0];
  
  if (command in commands) {
    const handler = commands[command];
    const isAdminOnly = adminOnly.includes(command);
    const commandName = command.replace('!', '');
    
    // Determine priority
    let priority: 'high' | 'medium' | 'low' = 'medium';
    if (isAdminOnly || commandName === 'kaynak') {
      priority = 'high';
    } else if (['stats', 'istatistik', 'help', 'yardim'].includes(commandName)) {
      priority = 'low';
    }
    
    if (enableQueue) {
      try {
        // Enqueue command
        await addCommandJob(
          commandName,
          {
            chatId: ctx.chat?.id || ctx.message?.chat?.id || 0,
            userId: ctx.from?.id || ctx.message?.from?.id || 0,
            username: ctx.from?.username || ctx.message?.from?.username,
            messageId: ctx.message?.message_id,
            data: {
              text: ctx.message?.text,
              entities: ctx.message?.entities
            },
            chatType: ctx.chat?.type || ctx.message?.chat?.type
          },
          priority
        );
        
        // Send processing message for commands that might take time
        if (commandName === 'kaynak') {
          await ctx.reply('⏳ İşleniyor...').catch(() => {});
        }
      } catch (error) {
        console.error(`Error enqueuing command ${commandName}:`, error);
        // Fallback to direct execution
        if (isAdminOnly) {
          return forAdmins(ctx, handler);
        } else {
          return handler(ctx);
        }
      }
    } else {
      // Direct execution
      if (isAdminOnly) {
        return forAdmins(ctx, handler);
      } else {
        return handler(ctx);
      }
    }
  } else {
    return easterEggHandler(ctx);
  }
}

module.exports = textHandler;
