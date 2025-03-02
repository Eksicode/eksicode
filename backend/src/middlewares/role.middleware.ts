import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { HttpException } from '../exceptions/HttpException';
import { RequestWithUser } from '../interfaces/auth.interface';

const prisma = new PrismaClient().$extends({
  model: {
    endpointAccess: {
      findFirst: async (args) => {
        const result = await prisma.endpointAccess.findFirst(args);
        return result;
      }
    }
  }
});

const roleMiddleware = () => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new HttpException(401, 'User not authenticated');
      }

      // Fetch user's roles and their associated permissions
      const userRoles = await prisma.userRole.findMany({
        where: { userId },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true
                }
              }
            }
          }
        }
      });

      // Get the current endpoint's path and method
      const path = req.baseUrl + req.path;
      const method = req.method.toLowerCase();

      // Fetch required roles and permissions for this endpoint from database
      const endpointAccess = await prisma.endpointAccess.findFirst({
        where: {
          path: path,
          method: method
        },
        include: {
          requiredRoles: true,
          requiredPermissions: true
        }
      });

      if (endpointAccess) {
        // Check role-based access
        if (endpointAccess.requiredRoles.length > 0) {
          const userRoleNames = userRoles.map(ur => ur.role.name.toLowerCase());
          const hasRequiredRole = endpointAccess.requiredRoles.some(role =>
            userRoleNames.includes(role.name.toLowerCase())
          );

          if (!hasRequiredRole) {
            throw new HttpException(403, 'Access denied: Required role not found');
          }
        }

        // Check permission-based access
        if (endpointAccess.requiredPermissions.length > 0) {
          const userPermissions = new Set(
            userRoles.flatMap(ur =>
              ur.role.permissions.map(rp =>
                rp.permission.name.toLowerCase()
              )
            )
          );

          const hasRequiredPermissions = endpointAccess.requiredPermissions.every(permission =>
            userPermissions.has(permission.name.toLowerCase())
          );

          if (!hasRequiredPermissions) {
            throw new HttpException(403, 'Access denied: Required permissions not found');
          }
        }
      }

      // If no roles or permissions are required, or all checks pass
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default roleMiddleware;