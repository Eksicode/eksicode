import * as http from 'http';
import { queryOne } from './db-client';
import { getRedisClient } from './redisClient';

const HEALTH_PORT = parseInt(process.env.HEALTH_PORT || '8080');

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  checks: {
    database: boolean;
    redis: boolean;
  };
  error?: string;
}

async function checkHealth(): Promise<HealthStatus> {
  const timestamp = new Date().toISOString();
  let dbHealthy = false;
  let redisHealthy = false;
  let error: string | undefined;

  // Check database
  try {
    const result = await queryOne<{ ok: number }>('SELECT 1 as ok');
    dbHealthy = result?.ok === 1;
  } catch (err) {
    error = `Database: ${(err as Error).message}`;
  }

  // Check Redis
  try {
    const redis = getRedisClient();
    const pong = await redis.ping();
    redisHealthy = pong === 'PONG';
  } catch (err) {
    error = error
      ? `${error}; Redis: ${(err as Error).message}`
      : `Redis: ${(err as Error).message}`;
  }

  const isHealthy = dbHealthy && redisHealthy;

  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp,
    checks: {
      database: dbHealthy,
      redis: redisHealthy
    },
    ...(error && { error })
  };
}

export function startHealthServer(): http.Server {
  const server = http.createServer(async (req, res) => {
    if (req.url === '/health' || req.url === '/') {
      try {
        const health = await checkHealth();
        const statusCode = health.status === 'healthy' ? 200 : 503;

        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(health));
      } catch (err) {
        res.writeHead(503, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: (err as Error).message
        }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  server.listen(HEALTH_PORT, '0.0.0.0', () => {
    console.log(`✅ Health server listening on port ${HEALTH_PORT}`);
  });

  return server;
}
