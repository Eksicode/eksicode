import { NextFunction, Response } from 'express';
import { RequestWithUser } from '../interfaces/auth.interface';
import { HttpException } from '../exceptions/HttpException';

const selfMiddleware = (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.id);
    const authenticatedUserId = req.user.id;

    if (isNaN(userId) || !authenticatedUserId) {
      throw new HttpException(403, 'Access denied');
    }

    if (userId !== authenticatedUserId) {
      throw new HttpException(403, 'You can only access your own data');
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default selfMiddleware;