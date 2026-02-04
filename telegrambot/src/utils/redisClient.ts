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
let isShuttingDown = false;

/**
 * Mark that the process is shutting down (stops reconnects and noisy logs).
 * Call this before closeRedisClient() during graceful shutdown.
 */
export function setRedisShuttingDown(): void {
  isShuttingDown = true;
}

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
      if (isShuttingDown) return null; // stop reconnecting
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
    if (!isShuttingDown) console.error('❌ Redis connection error:', error);
  });

  redisClient.on('connect', () => {
    if (!isShuttingDown) console.log('✅ Redis connected successfully');
  });

  redisClient.on('ready', () => {
    if (!isShuttingDown) console.log('✅ Redis ready to accept commands');
  });

  redisClient.on('close', () => {
    if (!isShuttingDown) console.log('⚠️ Redis connection closed');
  });

  redisClient.on('reconnecting', () => {
    if (!isShuttingDown) console.log('🔄 Redis reconnecting...');
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
  isShuttingDown = true;
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

export default getRedisClient;
