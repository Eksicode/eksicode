/**
 * Command worker - processes command jobs from the queue
 */

import { Worker, Job } from 'bullmq';
import { getRedisConnection } from '../utils/redisClient';
import { CommandJobData, JobResult } from '../queues/types';
import * as cmd from '../commands';
import { forAdmins } from '../utils';
import { Telegraf } from 'telegraf';

const redisConnection = getRedisConnection();

// Admin-only commands
const adminCommands = ['ban', 'unban', 'pin', 'kontrol', 'verify', 'hastebinize'];

// Command mapping - using any for flexibility with different context types
// TypeScript can't infer compatible types, so we use explicit any and type assertions
type CommandHandler = (ctx: any) => Promise<void> | void;

const commandMap: Record<string, CommandHandler> = {
  // Admin commands - using type assertion to bypass type checking
  'ban': (ctx: any) => forAdmins(ctx as any, cmd.banCommand as any),
  'unban': (ctx: any) => forAdmins(ctx as any, cmd.unbanCommand as any),
  'pin': (ctx: any) => forAdmins(ctx as any, cmd.pinCommand as any),
  'kontrol': (ctx: any) => forAdmins(ctx as any, cmd.kontrolCommand as any),
  'verify': (ctx: any) => forAdmins(ctx as any, cmd.verifyCommand as any),
  
  // Public commands
  'help': (ctx: any) => (cmd.helpCommand as any)(ctx),
  'yardim': (ctx: any) => (cmd.helpCommand as any)(ctx),
  'kaynak': (ctx: any) => (cmd.SourceBot as any)(ctx),
  'grup': (ctx: any) => (cmd.GroupBot as any)(ctx),
  'discord': (ctx: any) => (cmd.discordCommand as any)(ctx),
  'duyuru': (ctx: any) => (cmd.announcementCommand as any)(ctx),
  'youtube': (ctx: any) => (cmd.youtubeCommand as any)(ctx),
  'github': (ctx: any) => (cmd.githubCommand as any)(ctx),
  'twitter': (ctx: any) => (cmd.twitterCommand as any)(ctx),
  'report': (ctx: any) => (cmd.reportCommand as any)(ctx),
  'stats': (ctx: any) => (cmd.statsCommand as any)(ctx),
  'istatistik': (ctx: any) => (cmd.statsCommand as any)(ctx)
};

/**
 * Create a mock context from job data
 * Uses 'any' type to be compatible with different command handler expectations
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createContextFromJob(job: Job<CommandJobData>, bot: Telegraf): any {
  const { context } = job.data;
  
  // Create a comprehensive context object that matches what commands expect
  const ctx: any = {
    message: {
      text: context.data?.text || `/${job.data.command}`,
      entities: context.data?.entities || [{ length: job.data.command.length + 1 }],
      chat: {
        id: context.chatId,
        type: context.chatType || 'private'
      },
      from: {
        id: context.userId,
        username: context.username
      },
      message_id: context.messageId,
      reply_to_message: context.data?.reply_to_message
    },
    from: {
      id: context.userId,
      username: context.username
    },
    chat: {
      id: context.chatId
    },
    callbackQuery: context.callbackQueryId ? {
      id: context.callbackQueryId,
      data: context.data?.callback_data,
      from: {
        id: context.userId,
        username: context.username
      }
    } : undefined,
    deleteMessage: async () => {
      if (context.messageId) {
        await bot.telegram.deleteMessage(context.chatId, context.messageId);
      }
    },
    reply: async (text: string, options?: any) => {
      return bot.telegram.sendMessage(context.chatId, text, options);
    },
    replyWithMarkdown: async (text: string, options?: any) => {
      return bot.telegram.sendMessage(context.chatId, text, { ...options, parse_mode: 'Markdown' });
    },
    answerCbQuery: async (text?: string, options?: any) => {
      if (context.callbackQueryId) {
        return bot.telegram.answerCbQuery(context.callbackQueryId, text, options);
      }
    },
    telegram: bot.telegram
  };
  
  return ctx;
}

/**
 * Process command job
 */
async function processCommandJob(
  job: Job<CommandJobData>,
  bot: Telegraf
): Promise<JobResult> {
  try {
    const { command, context } = job.data;
    
    // Get command handler
    const handler = commandMap[command];
    
    if (!handler) {
      return {
        success: false,
        error: `Unknown command: ${command}`
      };
    }

    // Create context from job data
    const ctx = createContextFromJob(job, bot);
    
    // Execute command - handle both async and sync handlers
    const result = handler(ctx);
    if (result instanceof Promise) {
      await result;
    }
    
    return {
      success: true,
      message: `Command ${command} executed successfully`
    };
  } catch (error: any) {
    console.error(`Error processing command ${job.data.command}:`, error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Create command worker
 */
export function createCommandWorker(bot: Telegraf): Worker<CommandJobData, JobResult> {
  const worker = new Worker<CommandJobData, JobResult>(
    'commands',
    async (job) => {
      return processCommandJob(job, bot);
    },
    {
      connection: redisConnection,
      concurrency: parseInt(process.env.QUEUE_CONCURRENCY || '10'),
      limiter: {
        max: 30, // Max 30 jobs per interval
        duration: 1000 // Per second
      }
    }
  );

  worker.on('completed', (job: any) => {
    console.log(`✅ Command job ${job.id} (${job.data.command}) completed`);
  });

  worker.on('failed', (job: any, error: Error) => {
    console.error(`❌ Command job ${job?.id} (${job?.data.command}) failed:`, error.message);
  });

  worker.on('error', (error: Error) => {
    console.error('❌ Command worker error:', error);
  });

  return worker;
}

export default createCommandWorker;
