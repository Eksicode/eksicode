import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { HttpException } from '../exceptions/HttpException';

// Use a singleton pattern for PrismaClient to avoid multiple instances
let prismaInstance: PrismaClient | undefined;

function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}

/**
 * User middleware for populating the req.user object
 * This middleware should be used after authMiddleware to populate the full user object
 * @returns Express middleware function
 */
const userMiddleware = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'User not authenticated');
      }

      // Get the prisma instance
      const prisma = getPrisma();
      
      // Fetch user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          profilePicture: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          verified: true,
          emailVerified: true,
          roles: true,
          permissions: true,
          createdAt: true,
          updatedAt: true,
        }
      });

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      // Populate req.user
      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default userMiddleware; 