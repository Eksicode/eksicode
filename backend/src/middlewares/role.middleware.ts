import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { HttpException } from '../exceptions/HttpException';
import { RequestWithUser } from '../interfaces/auth.interface';

const prisma = new PrismaClient();

const roleMiddleware = (requiredRoles: string[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException(401, 'User not authenticated');
      }

      // Fetch user's actual roles from database
      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: { role: true }
      });

      const userRoleNames = userRoles.map(ur => ur.role.name);

      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some(role =>
        userRoleNames.includes(role)
      );

      if (!hasRequiredRole) {
        throw new HttpException(403, 'Access denied: Insufficient permissions');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default roleMiddleware;