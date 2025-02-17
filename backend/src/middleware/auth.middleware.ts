import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '../exceptions/HttpException';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return next(new HttpException(401, 'Authentication token is missing'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new HttpException(401, 'Invalid token'));
    }
    req.user = decoded;
    next();
  });
}; 