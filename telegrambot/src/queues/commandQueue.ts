/**
 * Command queue for processing bot commands
 */

import { Queue, QueueOptions } from 'bullmq';
import { getRedisConnection } from '../utils/redisClient';
import { CommandJobData, JobPriority } from './types';

const redisConnection = getRedisConnection();

const queueOptions: QueueOptions = {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 1000 // Keep max 1000 completed jobs
    },
    removeOnFail: {
      age: 86400 // Keep failed jobs for 24 hours
    }
  }
};

export const commandQueue = new Queue<CommandJobData>('commands', queueOptions);

// Queue event listeners
commandQueue.on('error', (error: Error) => {
  console.error('❌ Command queue error:', error);
});

commandQueue.on('waiting', (job: any) => {
  console.log(`⏳ Job ${job.id} is waiting`);
});

/**
 * Add command job to queue
 */
export async function addCommandJob(
  command: string,
  context: CommandJobData['context'],
  priority: 'high' | 'medium' | 'low' = 'medium'
): Promise<string> {
  const jobData: CommandJobData = {
    type: 'command',
    command,
    context,
    priority
  };

  const priorityValue = priority === 'high' ? JobPriority.HIGH : 
                        priority === 'medium' ? JobPriority.MEDIUM : 
                        JobPriority.LOW;

  const job = await commandQueue.add(
    command,
    jobData,
    {
      priority: priorityValue,
      jobId: `${command}_${context.userId}_${Date.now()}`
    }
  );

  return job.id!;
}

/**
 * Get queue metrics
 */
export async function getQueueMetrics() {
  const waiting = await commandQueue.getWaitingCount();
  const active = await commandQueue.getActiveCount();
  const completed = await commandQueue.getCompletedCount();
  const failed = await commandQueue.getFailedCount();
  const delayed = await commandQueue.getDelayedCount();

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
export async function closeCommandQueue(): Promise<void> {
  await commandQueue.close();
}

export default commandQueue;
