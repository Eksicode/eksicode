import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import tokenBlacklistService from '../services/tokenBlacklist.service';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      token?: string;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header only (no cookie fallback)
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false,
        message: 'Authentication required. Please provide a valid Bearer token.' 
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    // Check if token is blacklisted
    if (tokenBlacklistService.isTokenBlacklisted(token)) {
      res.status(401).json({ 
        success: false,
        message: 'Token has been revoked. Please login again.' 
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: number };
      req.userId = decoded.id;
      req.token = token; // Store token for potential blacklisting
      next();
    } catch (error) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;