/**
 * Tests for eksicodeBot-user: group user count update job
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  runUserCountUpdate,
  USER_COUNT_CRON_SCHEDULE,
  type UserCountJobDeps
} from '../src/userCountJob';

describe('eksicodeBot-user (user count job)', () => {
  describe('USER_COUNT_CRON_SCHEDULE', () => {
    it('should run 2 times per day (01:00 and 13:00)', () => {
      assert.strictEqual(USER_COUNT_CRON_SCHEDULE, '0 1,13 * * *');
    });
  });

  describe('runUserCountUpdate', () => {
    it('should fetch groups, get member counts, and update DB for each group', async () => {
      const queryCalls: { text: string; params?: any[] }[] = [];
      const queryManyCalls: { text: string; params?: any[] }[] = [];
      const getChatMembersCountCalls: string[] = [];

      const mockGroups = [
        { id: 1, name: 'Group A', channelId: '-100111', members: 0 },
        { id: 2, name: 'Group B', channelId: '-100222', members: 0 }
      ];

      const deps: UserCountJobDeps = {
        query: async (text, params) => {
          queryCalls.push({ text, params });
          return { rowCount: 1 };
        },
        queryMany: async (text: string) => {
          queryManyCalls.push({ text });
          return mockGroups;
        },
        getChatMembersCount: async (chatId) => {
          getChatMembersCountCalls.push(chatId);
          if (chatId === '-100111') return 42;
          if (chatId === '-100222') return 100;
          return 0;
        },
        sleepMs: 0 // no delay in tests
      };

      await runUserCountUpdate(deps);

      assert.strictEqual(queryManyCalls.length, 1);
      assert.ok(
        queryManyCalls[0].text.includes('telegram_groups'),
        'queryMany should select from telegram_groups'
      );
      assert.ok(
        queryManyCalls[0].text.includes('active = true'),
        'queryMany should filter active groups'
      );

      assert.strictEqual(getChatMembersCountCalls.length, 2);
      assert.deepStrictEqual(getChatMembersCountCalls, ['-100111', '-100222']);

      assert.strictEqual(queryCalls.length, 2, 'UPDATE should be called for each group');
      assert.ok(
        queryCalls[0].text.includes('UPDATE telegram_groups'),
        'query should be UPDATE telegram_groups'
      );
      assert.deepStrictEqual(queryCalls[0].params, [42, 1]);
      assert.deepStrictEqual(queryCalls[1].params, [100, 2]);
    });

    it('should skip sleep when sleepMs is 0', async () => {
      const deps: UserCountJobDeps = {
        query: async () => ({ rowCount: 1 }),
        queryMany: async () => [],
        getChatMembersCount: async () => 0,
        sleepMs: 0
      };
      await runUserCountUpdate(deps);
      // Completes without hanging
    });

    it('should continue processing other groups when one getChatMembersCount fails', async () => {
      const queryCalls: { params?: any[] }[] = [];
      const mockGroups = [
        { id: 1, name: 'Fail', channelId: '-fail', members: 0 },
        { id: 2, name: 'Ok', channelId: '-ok', members: 0 }
      ];

      const deps: UserCountJobDeps = {
        query: async (_text, params) => {
          queryCalls.push({ params });
          return { rowCount: 1 };
        },
        queryMany: async () => mockGroups,
        getChatMembersCount: async (chatId) => {
          if (chatId === '-fail') throw new Error('Telegram API error');
          return 5;
        },
        sleepMs: 0
      };

      await runUserCountUpdate(deps);

      // Only the successful group should trigger an UPDATE
      assert.strictEqual(queryCalls.length, 1);
      assert.deepStrictEqual(queryCalls[0].params, [5, 2]);
    });
  });
});
