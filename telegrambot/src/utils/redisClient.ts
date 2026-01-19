/**
 * Redis client for shared state management
 */

import Redis from 'ioredis';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env')
});

let redisClient: Redis | null = null;

/**
 * Get or create Redis client instance
 */
export function getRedisClient(): Redis {
  if (redisClient) {
    return redisClient;
  }

  const config: any = {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    db: parseInt(process.env.REDIS_DB || '0'),
    retryStrategy: (times: number) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,
    lazyConnect: false
  };

  if (process.env.REDIS_PASSWORD) {
    config.password = process.env.REDIS_PASSWORD;
  }

  redisClient = new Redis(config);

  redisClient.on('error', (error: Error) => {
    console.error('❌ Redis connection error:', error);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('ready', () => {
    console.log('✅ Redis ready to accept commands');
  });

  redisClient.on('close', () => {
    console.log('⚠️ Redis connection closed');
  });

  redisClient.on('reconnecting', () => {
    console.log('🔄 Redis reconnecting...');
  });

  return redisClient;
}

/**
 * Get Redis connection options for BullMQ
 */
export function getRedisConnection(): { host: string; port: number; password?: string; db: number } {
  return {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0')
  };
}

/**
 * Close Redis connection
 */
export async function closeRedisClient(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

export default getRedisClient;
