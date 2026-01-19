/**
 * Cron worker - processes scheduled cron jobs
 */

import { Worker, Job } from 'bullmq';
import { getRedisConnection } from '../utils/redisClient';
import { CronJobData, JobResult } from '../queues/types';
import { Telegraf } from 'telegraf';
import axios from 'axios';
import { apiAuth } from '../utils';

const redisConnection = getRedisConnection();

/**
 * Process member count update job
 */
async function processMemberCountJob(job: Job<CronJobData>): Promise<JobResult> {
  try {
    console.log('Eksicode User Counts Checking Started');
    console.log('-----------------------------------------');

    const jwt = await apiAuth();
    const bot = job.data.data.bot as Telegraf;

    const updateMembers = async (id: number, members: number): Promise<void> => {
      try {
        const requestData = { members };
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt
          }
        };
        await axios.put(`${process.env.API_URL}/telegrams/${id}`, requestData, config);
      } catch (err) {
        console.error('Error updating members:', err);
      }
    };

    // Get group list from API
    const response = await axios.get(`${process.env.API_URL}/telegrams?_sort=ListOrder:ASC`);
    const allGroups = response.data;

    console.log('total groups: ' + allGroups.length);

    // Process groups sequentially with delay
    for (let i = 0; i < allGroups.length; i++) {
      try {
        const memberCount = await bot.telegram.getChatMembersCount(allGroups[i].channelID);
        allGroups[i].members = memberCount;
        
        console.log(allGroups[i].name, memberCount + ' user');
        await updateMembers(allGroups[i].id, memberCount);
        console.log(allGroups[i].name + ' Updated...');
        console.log('-------------------------');
        
        // Rate limiting: 2 second delay between groups
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (err: any) {
        console.log(`${allGroups[i].name} wasn't respond any date.`);
        console.error(err);
      }
    }

    console.log('Eksicode User Counts Checking finished');
    console.log('-----------------------------------------');

    return {
      success: true,
      message: `Processed ${allGroups.length} groups`
    };
  } catch (error: any) {
    console.error('Member count job error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Process source validation job
 */
async function processSourceValidationJob(job: Job<CronJobData>): Promise<JobResult> {
  try {
    console.log('Eksicode Source Checking Process Started');
    console.log('-----------------------------------------');

    const jwt = await apiAuth();

    const changeApprove = async (id: number, status: string): Promise<void> => {
      try {
        const requestData = { approved: status };
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt
          }
        };
        await axios.put(`${process.env.API_URL}/kaynaklars/${id}`, requestData, config);
      } catch (err) {
        console.error('Error updating approval status:', err);
      }
    };

    // Get all sources
    const response = await axios.get(`${process.env.API_URL}/kaynaklars?_limit=10000000&_sort=id:ASC`);
    const allSources = response.data;

    console.log('total links: ' + allSources.length);

    const getConfig = {
      timeout: 60000,
      maxContentLength: 500 * 1000 * 1000,
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
        Authorization: 'Bearer ' + jwt
      }
    };

    let processed = 0;

    // Process sources in parallel batches
    const batchSize = 10;
    for (let i = 0; i < allSources.length; i += batchSize) {
      const batch = allSources.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (source: any) => {
          try {
            const response = await axios.get(source.doc_link, getConfig);
            
            if (!response.status || response.status >= 399) {
              await changeApprove(source.id, 'false');
              processed++;
              console.log(`${processed}/${allSources.length} - ${source.doc_link} is down`);
            } else if (response.status < 399 && source.status === 'false') {
              await changeApprove(source.id, 'true');
              processed++;
              console.log(`${processed}/${allSources.length} - ${source.doc_link} is now up`);
            } else {
              processed++;
              console.log(`${processed}/${allSources.length} - ${response.status} ${source.doc_link} is up`);
            }
          } catch (error: any) {
            processed++;
            console.error(`Error checking ${source.doc_link}:`, error.message);
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
    case 'member_count':
      return processMemberCountJob(job);
    case 'source_validation':
      return processSourceValidationJob(job);
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
    console.log(`✅ Cron job ${job.id} (${job.data.type}) completed`);
  });

  worker.on('failed', (job: any, error: Error) => {
    console.error(`❌ Cron job ${job?.id} (${job?.data.type}) failed:`, error.message);
  });

  worker.on('error', (error: Error) => {
    console.error('❌ Cron worker error:', error);
  });

  return worker;
}

export default createCronWorker;
