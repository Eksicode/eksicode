import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';
import config from '../config';

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const details = error.details || null;

  // Check if headers have already been sent to prevent "Cannot set headers after they are sent" error
  if (res.headersSent) {
    return next(error);
  }

  // Ensure CORS headers are set on error responses
  const whitelist = config.allowedOrigins || [
    "http://localhost:3000",
    "https://eksicode.org",
    "https://www.eksicode.org",
    "https://api.eksicode.org",
  ];

  const origin = req.headers.origin;
  if (origin && (config.nodeEnv === "development" || whitelist.includes(origin))) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization");

  res.status(status).json({
    success: false,
    message,
    details,
  });
};