/**
 * Cron job queue for scheduled tasks
 */

import { Queue, QueueOptions } from 'bullmq';
import { getRedisConnection } from '../utils/redisClient';
import { CronJobData } from './types';

const redisConnection = getRedisConnection();

const queueOptions: QueueOptions = {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 5000
    },
    removeOnComplete: true,
    removeOnFail: {
      age: 86400 // Keep failed jobs for 24 hours
    }
  }
};

export const cronQueue = new Queue<CronJobData>('cron', queueOptions);

// Queue event listeners
cronQueue.on('error', (error: Error) => {
  console.error('❌ Cron queue error:', error);
});

cronQueue.on('waiting', (job: any) => {
  console.log(`⏳ Cron job ${job.id} is waiting`);
});

/**
 * Add cron job to queue
 */
export async function addCronJob(
  type: CronJobData['type'],
  data: any,
  options?: {
    delay?: number;
    repeat?: {
      pattern: string; // Cron pattern
      tz?: string;
    };
  }
): Promise<string> {
  const jobData: CronJobData = {
    type,
    data
  };

  const jobOptions: any = {
    jobId: `${type}_${Date.now()}`
  };

  if (options?.delay) {
    jobOptions.delay = options.delay;
  }

  if (options?.repeat) {
    jobOptions.repeat = options.repeat;
  }

  const job = await cronQueue.add(type, jobData, jobOptions);

  return job.id!;
}

/**
 * Get cron queue metrics
 */
export async function getCronQueueMetrics() {
  const waiting = await cronQueue.getWaitingCount();
  const active = await cronQueue.getActiveCount();
  const completed = await cronQueue.getCompletedCount();
  const failed = await cronQueue.getFailedCount();
  const delayed = await cronQueue.getDelayedCount();

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed
  };
}

/**
 * Clean up queue
 */
export async function closeCronQueue(): Promise<void> {
  await cronQueue.close();
}

export default cronQueue;
