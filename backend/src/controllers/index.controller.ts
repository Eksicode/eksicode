import { NextFunction, Request, Response } from 'express';
import os from 'os';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  };

  public health = (req: Request, res: Response, next: NextFunction) => {
    try {
      const healthData = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        worker: {
          pid: process.pid,
          workerId: process.env.WORKER_ID || 'main',
          memoryUsage: process.memoryUsage(),
          cpuUsage: process.cpuUsage()
        },
        system: {
          platform: os.platform(),
          arch: os.arch(),
          nodeVersion: process.version,
          loadAverage: os.loadavg(),
          totalMemory: os.totalmem(),
          freeMemory: os.freemem(),
          cpuCount: os.cpus().length
        },
        environment: {
          nodeEnv: process.env.NODE_ENV,
          clustering: process.env.ENABLE_CLUSTERING === 'true',
          maxWorkers: process.env.MAX_WORKERS
        }
      };

      res.status(200).json(healthData);
    } catch (error) {
      next(error);
    }
  };

  public ready = (req: Request, res: Response, next: NextFunction) => {
    try {
      // Simple readiness check
      const readyData = {
        status: 'READY',
        worker: process.pid,
        timestamp: new Date().toISOString()
      };

      res.status(200).json(readyData);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;