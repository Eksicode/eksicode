import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import config from '../config';

// In development mode, use a much higher limit or disable rate limiting
const isDevelopment = config.nodeEnv === 'development';

const authLimiter = isDevelopment
  ? // Development: No rate limiting
    (req: Request, res: Response, next: NextFunction) => next()
  : // Production: Apply rate limiting
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50, // limit each IP to 50 requests per windowMs
      message: 'Too many requests from this IP, please try again after 15 minutes',
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      handler: (req: Request, res: Response) => {
        res.status(429).json({
          success: false,
          message: 'Too many requests from this IP, please try again after 15 minutes',
        });
      },
    });

export default authLimiter;
