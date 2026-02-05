/**
 * Group user count update job (eksicodeBot-user).
 * Runs on a schedule to fetch Telegram group member counts and update the database.
 */

/** Cron schedule: 01:00 and 13:00 every day (2 times per day) */
export const USER_COUNT_CRON_SCHEDULE = '0 1,13 * * *';

export interface TelegramGroup {
  id: number;
  name: string;
  channelId: string | null;
  members: number;
}

export interface UserCountJobDeps {
  query: (text: string, params?: any[]) => Promise<unknown>;
  queryMany: (text: string, params?: any[]) => Promise<TelegramGroup[]>;
  getChatMembersCount: (chatId: string) => Promise<number>;
  sleepMs?: number;
}

const defaultSleepMs = 2000;

/**
 * Update group member count in database
 */
async function updateMembers(
  queryFn: UserCountJobDeps['query'],
  id: number,
  members: number
): Promise<void> {
  try {
    await queryFn(
      `UPDATE telegram_groups SET members = $1, "updatedAt" = NOW() WHERE id = $2`,
      [members, id]
    );
  } catch (err) {
    console.error(`Error updating members for group ${id}:`, err);
  }
}

/**
 * Run the user count update job: fetch member counts from Telegram and update DB.
 * Used by telegram.ts (eksicodeBot-user) and by tests with mocked deps.
 */
export async function runUserCountUpdate(deps: UserCountJobDeps): Promise<void> {
  const sleepMs = deps.sleepMs ?? defaultSleepMs;
  const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

  console.log('Eksicode User Counts Checking Started');
  console.log('-----------------------------------------');

  const allGroups = await deps.queryMany(
    `SELECT id, name, "channelId", members
     FROM telegram_groups
     WHERE active = true AND "channelId" IS NOT NULL
     ORDER BY "listOrder" ASC`
  );

  console.log('total groups: ' + allGroups.length);

  for (const group of allGroups) {
    try {
      const memberCount = await deps.getChatMembersCount(group.channelId!);
      console.log(group.name, memberCount + ' user');
      await updateMembers(deps.query, group.id, memberCount);
      console.log(group.name + ' Updated...');
      console.log('-------------------------');
      await sleep(sleepMs);
    } catch (err) {
      console.log(`${group.name} wasn't respond any data.`);
      console.error(err);
    }
  }

  console.log('Eksicode User Counts Checking finished');
  console.log('-----------------------------------------');
}
