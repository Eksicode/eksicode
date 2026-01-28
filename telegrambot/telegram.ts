import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, '.env')
});

import { Telegraf } from 'telegraf';
import * as cron from 'node-cron';
import { query, queryMany } from './src/utils/db-client';

interface TelegramGroup {
  id: number;
  name: string;
  channel_id: string | null;
  members: number;
}

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Update group member count in database
 */
async function updateMembers(id: number, members: number): Promise<void> {
  try {
    await query(
      `UPDATE telegram_groups SET members = $1, "updatedAt" = NOW() WHERE id = $2`,
      [members, id]
    );
  } catch (err) {
    console.error(`Error updating members for group ${id}:`, err);
  }
}

/**
 * Cron Job
 *
 * Run cron job everyday at 01:00
 */
cron.schedule('00 01 * * *', async () => {
  console.log('Eksicode User Counts Checking Started');
  console.log('-----------------------------------------');

  try {
    // Get all active groups from database
    const allGroups = await queryMany<TelegramGroup>(
      `SELECT id, name, channel_id, members
       FROM telegram_groups
       WHERE active = true AND channel_id IS NOT NULL
       ORDER BY "listOrder" ASC`
    );

    console.log('total groups: ' + allGroups.length);

    const bot = new Telegraf(process.env.BOT_TOKEN!);

    // Get group member count from Telegram and update database
    for (const group of allGroups) {
      try {
        const memberCount = await bot.telegram.getChatMembersCount(group.channel_id!);

        console.log(group.name, memberCount + ' user');
        await updateMembers(group.id, memberCount);
        console.log(group.name + ' Updated...');
        console.log('-------------------------');

        await sleep(2000);
      } catch (err) {
        console.log(`${group.name} wasn't respond any data.`);
        console.error(err);
      }
    }

    console.log('Eksicode User Counts Checking finished');
    console.log('-----------------------------------------');
  } catch (err) {
    console.error('Error in user count cron job:', err);
  }
});
