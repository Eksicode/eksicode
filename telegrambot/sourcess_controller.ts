import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, '.env')
});

import * as cron from 'node-cron';
import { query, queryMany } from './src/utils/db-client';

interface Source {
  id: number;
  url: string;
  approved: boolean;
}

/**
 * Update source approval status in database
 */
async function updateApprovalStatus(id: number, approved: boolean): Promise<void> {
  try {
    await query(
      `UPDATE sources SET approved = $1, "updatedAt" = NOW() WHERE id = $2`,
      [approved, id]
    );
  } catch (err) {
    console.error(`Error updating approval status for source ${id}:`, err);
  }
}

/**
 * Check if a URL is accessible
 */
async function checkUrlStatus(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
      }
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    // If HEAD fails, try GET
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9'
        }
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }
}

/**
 * Cron Job
 *
 * Run cron job everyday at 01:00
 */
cron.schedule('00 01 * * *', async () => {
  console.log('Eksicode Source Checking Process Started');
  console.log('-----------------------------------------');

  try {
    // Get all sources from database
    const allSources = await queryMany<Source>(
      `SELECT id, url, approved FROM sources WHERE active = true ORDER BY id ASC`
    );

    console.log('total links: ' + allSources.length);

    let processed = 0;

    // Process sources in batches to avoid overwhelming the system
    const batchSize = 10;
    for (let i = 0; i < allSources.length; i += batchSize) {
      const batch = allSources.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (source) => {
          try {
            const isUp = await checkUrlStatus(source.url);

            if (!isUp && source.approved) {
              await updateApprovalStatus(source.id, false);
              processed++;
              console.log(`${processed}/${allSources.length} - ${source.url} is down`);
            } else if (isUp && !source.approved) {
              await updateApprovalStatus(source.id, true);
              processed++;
              console.log(`${processed}/${allSources.length} - ${source.url} is now up`);
            } else {
              processed++;
              console.log(`${processed}/${allSources.length} - ${source.url} is ${isUp ? 'up' : 'down'}`);
            }
          } catch (error: any) {
            processed++;
            console.error(`Error checking ${source.url}:`, error.message);
          }
        })
      );
    }

    console.log('Eksicode Source Checking Process finished');
    console.log('-----------------------------------------');
  } catch (err) {
    console.error('Error in source checking cron job:', err);
  }
});
