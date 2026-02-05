/**
 * Cron worker - processes scheduled cron jobs
 */

import { Worker, Job } from 'bullmq';
import { getRedisConnection } from '../utils/redisClient';
import { CronJobData, JobResult } from '../queues/types';
import { query, queryMany } from '../utils/db-client';

const redisConnection = getRedisConnection();

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
  } catch {
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
 * Process source validation job
 */
async function processSourceValidationJob(): Promise<JobResult> {
  try {
    console.log('Eksicode Source Checking Process Started');
    console.log('-----------------------------------------');

    // Get all sources from database
    const allSources = await queryMany<Source>(
      `SELECT id, url, approved FROM sources WHERE active = true ORDER BY id ASC`
    );

    console.log('total links: ' + allSources.length);

    let processed = 0;

    // Process sources in parallel batches
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

    return {
      success: true,
      message: `Processed ${processed} sources`
    };
  } catch (error: any) {
    console.error('Source validation job error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Process cron job
 */
async function processCronJob(job: Job<CronJobData>): Promise<JobResult> {
  const { type } = job.data;

  switch (type) {
    case 'source_validation':
      return processSourceValidationJob();
    case 'cleanup':
      // Cleanup job - implement as needed
      return {
        success: true,
        message: 'Cleanup completed'
      };
    default:
      return {
        success: false,
        error: `Unknown cron job type: ${type}`
      };
  }
}

/**
 * Create cron worker
 */
export function createCronWorker(): Worker<CronJobData, JobResult> {
  const worker = new Worker<CronJobData, JobResult>(
    'cron',
    processCronJob,
    {
      connection: redisConnection,
      concurrency: 1, // Process one cron job at a time
      limiter: {
        max: 1,
        duration: 1000
      }
    }
  );

  worker.on('completed', (job: any) => {
    console.log(`Cron job ${job.id} (${job.data.type}) completed`);
  });

  worker.on('failed', (job: any, error: Error) => {
    console.error(`Cron job ${job?.id} (${job?.data.type}) failed:`, error.message);
  });

  worker.on('error', (error: Error) => {
    console.error('Cron worker error:', error);
  });

  return worker;
}

export default createCronWorker;
