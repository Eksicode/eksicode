import * as path from 'path';
import * as dotenv from 'dotenv';

// Load telegrambot .env first so DB/Redis/API vars are available before any imports
dotenv.config({
  path: path.join(__dirname, '.env')
});

import { Telegraf } from 'telegraf';
import { verificationManager } from './src/utils';
import { addCommandJob } from './src/queues';
import { createCommandWorker, createCronWorker } from './src/workers';
import { getRedisClient, closeRedisClient, setRedisShuttingDown } from './src/utils/redisClient';

const bot = new Telegraf(process.env.BOT_TOKEN!);
const enableQueue = process.env.ENABLE_QUEUE === 'true';

// Import commands and handlers (still JavaScript, use require)
const cmd = require('./src/commands');
const utils = require('./src/utils');
const handlers = require('./src/handlers');

// Initialize queue system if enabled
let commandWorker: any = null;
let cronWorker: any = null;

if (enableQueue) {
  try {
    // Test Redis connection
    const redis = getRedisClient();
    redis.ping().then(() => {
      console.log('✅ Redis connection verified');
    }).catch((error) => {
      console.error('❌ Redis connection failed:', error);
      console.log('⚠️ Falling back to direct execution mode');
    });

    // Create workers
    commandWorker = createCommandWorker(bot);
    cronWorker = createCronWorker();
    
    console.log('✅ Queue system initialized');
  } catch (error) {
    console.error('❌ Failed to initialize queue system:', error);
    console.log('⚠️ Falling back to direct execution mode');
  }
} else {
  console.log('ℹ️ Queue system disabled (ENABLE_QUEUE=false)');
}

// Restore pending verifications from database on startup
verificationManager.restorePendingVerifications(bot.telegram).then(() => {
  console.log('✅ Pending verifications restored from database');
}).catch((error) => {
  console.error('❌ Error restoring pending verifications:', error);
});

// Middleware for logging
bot.use(async (ctx: any, next: any) => {
  await utils.log(ctx);
  await next();
});

// Command handler wrapper - enqueues or executes directly
async function handleCommand(ctx: any, commandName: string, handler: (ctx: any) => Promise<void>, priority: 'high' | 'medium' | 'low' = 'medium') {
  if (enableQueue && commandWorker) {
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
            entities: ctx.message?.entities,
            reply_to_message: ctx.message?.reply_to_message
          },
          chatType: ctx.chat?.type || ctx.message?.chat?.type
        },
        priority
      );
      
      // Send processing message for commands that might take time
      if (['kaynak', 'kontrol'].includes(commandName)) {
        await ctx.reply('⏳ İşleniyor...').catch(() => {});
      }
    } catch (error) {
      console.error(`Error enqueuing command ${commandName}:`, error);
      // Fallback to direct execution
      return handler(ctx);
    }
  } else {
    // Direct execution
    return handler(ctx);
  }
}

// Admin commands
bot.command('ban', (ctx: any) => handleCommand(ctx, 'ban', () => utils.forAdmins(ctx, cmd.banCommand), 'high'));
bot.command('unban', (ctx: any) => handleCommand(ctx, 'unban', () => utils.forAdmins(ctx, cmd.unbanCommand), 'high'));
bot.command('pin', (ctx: any) => handleCommand(ctx, 'pin', () => utils.forAdmins(ctx, cmd.pinCommand), 'high'));
bot.command('kontrol', (ctx: any) => handleCommand(ctx, 'kontrol', () => utils.forAdmins(ctx, cmd.kontrolCommand), 'high'));
bot.command('verify', (ctx: any) => handleCommand(ctx, 'verify', () => utils.forAdmins(ctx, cmd.verifyCommand), 'high'));

// Public commands
bot.command('yardim', (ctx: any) => handleCommand(ctx, 'help', () => cmd.helpCommand(ctx), 'low'));
bot.command('help', (ctx: any) => handleCommand(ctx, 'help', () => cmd.helpCommand(ctx), 'low'));

// Event handlers
bot.on(['new_chat_members', 'left_chat_member'], (ctx: any) => handlers.joinedLeftUserHandler(ctx));
bot.on('text', (ctx: any) => handlers.textHandler(ctx));
bot.on('callback_query', handlers.callbackHandler);

// Launch bot
bot.launch();

console.log('🤖 EksiCode Bot started successfully!');

// Enable graceful stop
async function gracefulShutdown(signal: string) {
  console.log(`\n${signal} received, shutting down gracefully...`);
  setRedisShuttingDown();

  // Stop bot
  await bot.stop(signal);
  
  // Close workers
  if (commandWorker) {
    await commandWorker.close();
  }
  if (cronWorker) {
    await cronWorker.close();
  }
  
  // Close Redis connection
  await closeRedisClient();
  
  process.exit(0);
}

process.once('SIGINT', () => gracefulShutdown('SIGINT'));
process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
