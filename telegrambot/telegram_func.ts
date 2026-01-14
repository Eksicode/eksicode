import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, '../.env')
});

import { Telegraf } from 'telegraf';
import { verificationManager } from './src/utils';

const bot = new Telegraf(process.env.BOT_TOKEN!);

// Import commands and handlers (still JavaScript, use require)
const cmd = require('./src/commands');
const utils = require('./src/utils');
const handlers = require('./src/handlers');

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

// Admin commands
bot.command('ban', (ctx: any) => utils.forAdmins(ctx, cmd.banCommand));
bot.command('unban', (ctx: any) => utils.forAdmins(ctx, cmd.unbanCommand));
bot.command('pin', (ctx: any) => utils.forAdmins(ctx, cmd.pinCommand));
bot.command('kontrol', (ctx: any) => utils.forAdmins(ctx, cmd.kontrolCommand));
bot.command('verify', (ctx: any) => utils.forAdmins(ctx, cmd.verifyCommand));

// Public commands
bot.command('yardim', (ctx: any) => cmd.helpCommand(ctx));
bot.command('help', (ctx: any) => cmd.helpCommand(ctx));

// Event handlers
bot.on(['new_chat_members', 'left_chat_member'], (ctx: any) => handlers.joinedLeftUserHandler(ctx));
bot.on('text', (ctx: any) => handlers.textHandler(ctx));
bot.on('callback_query', handlers.callbackHandler);

// Launch bot
bot.launch();

console.log('🤖 EksiCode Bot started successfully!');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
