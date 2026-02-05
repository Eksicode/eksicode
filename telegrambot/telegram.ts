import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, '.env')
});

import { Telegraf } from 'telegraf';
import * as cron from 'node-cron';
import { query, queryMany } from './src/utils/db-client';
import {
  runUserCountUpdate,
  USER_COUNT_CRON_SCHEDULE,
  type TelegramGroup
} from './src/userCountJob';

/**
 * Cron Job (eksicodeBot-user)
 *
 * Runs 2 times per day at 01:00 and 13:00 to update group member counts in the database.
 */
const bot = new Telegraf(process.env.BOT_TOKEN!);

cron.schedule(USER_COUNT_CRON_SCHEDULE, async () => {
  try {
    await runUserCountUpdate({
      query,
      queryMany: (text, params) => queryMany<TelegramGroup>(text, params),
      getChatMembersCount: (chatId) => bot.telegram.getChatMembersCount(chatId)
    });
  } catch (err) {
    console.error('Error in user count cron job:', err);
  }
});
