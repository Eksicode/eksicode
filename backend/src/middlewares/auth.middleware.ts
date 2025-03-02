import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Try cookie first
    const tokenFromCookie = req.cookies['auth_token'];
    
    // Then try Authorization header
    const tokenFromHeader = req.header('Authorization')?.replace('Bearer ', '');
    
    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as { id: number };
      req.userId = decoded.id;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;