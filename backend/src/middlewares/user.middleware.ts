import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import { prisma } from "../config/database";

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let prismaInstance = req.app.locals.prisma;
    if (!prismaInstance) {
      prismaInstance = prisma;
    }

      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'User not authenticated');
      }

      // Fetch user data
      const user = await prismaInstance.user.findUnique({
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