import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import { prisma } from "../config/database";
import { RoleGuard } from "../utils/roleGuard";
import { ROLE_NAMES } from "../constants/roles";

// Type definitions for better type safety
type RoleWithPermissions = {
  id: number;
  name: string;
  permissions: {
    id: number;
    name: string;
  }[];
};

type UserRoleWithRelations = {
  userId?: number;
  roleId?: number;
  role: RoleWithPermissions;
};

type EndpointAccessWithRelations = {
  id: number;
  path: string;
  method: string;
  roles?: { id: number; name: string }[];
  permissions?: { id: number; name: string }[];
};

export const roleMiddleware = (requiredRoles?: string[], options?: {
  requireAll?: boolean; // If true, user must have ALL roles. If false, user must have ANY role (default)
  checkHierarchy?: boolean; // If true, check role hierarchy levels (default: false)
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let prismaInstance = req.app.locals.prisma;
      if (!prismaInstance) {
        prismaInstance = prisma;
      }

      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'User not authenticated');
      }

      // Initialize role guard
      const roleGuard = new RoleGuard(prismaInstance);
      
      // Load user with roles and permissions
      const user = await roleGuard.loadUserWithPermissions(userId);
      
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      // If specific roles are required via parameter
      if (requiredRoles && requiredRoles.length > 0) {
        const requireAll = options?.requireAll ?? false;
        
        if (requireAll) {
          // User must have ALL specified roles
          if (!roleGuard.hasAllRoles(user, requiredRoles)) {
            throw new HttpException(403, `Access denied: All of these roles required: ${requiredRoles.join(', ')}`);
          }
        } else {
          // User must have ANY of the specified roles
          if (!roleGuard.hasAnyRole(user, requiredRoles)) {
            throw new HttpException(403, `Access denied: One of these roles required: ${requiredRoles.join(', ')}`);
          }
        }
      } else {
        // Check endpoint-specific access requirements from database
        const path = req.baseUrl + req.path;
        const method = req.method.toLowerCase();

        const endpointAccess = await prismaInstance.endpointAccess.findFirst({
          where: { path, method },
          include: {
            roles: true,
            permissions: true
          }
        }) as unknown as EndpointAccessWithRelations | null;

        if (endpointAccess) {
          // Check role-based access
          if (endpointAccess.roles && endpointAccess.roles.length > 0) {
            const endpointRoleNames = endpointAccess.roles.map(role => role.name);
            if (!roleGuard.hasAnyRole(user, endpointRoleNames)) {
              throw new HttpException(403, 'Access denied: Required role not found');
            }
          }

          // Check permission-based access
          if (endpointAccess.permissions && endpointAccess.permissions.length > 0) {
            const requiredPermissionNames = endpointAccess.permissions.map(
              permission => permission.name
            );
            
            if (!roleGuard.hasAllPermissions(user, requiredPermissionNames)) {
              throw new HttpException(403, 'Access denied: Required permissions not found');
            }
          }
        }
      }

      // If all checks pass
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Helper middleware to check for specific permissions
 */
export const permissionMiddleware = (requiredPermissions: string[], options?: {
  requireAll?: boolean; // If true, user must have ALL permissions. If false, user must have ANY permission (default)
}) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let prismaInstance = req.app.locals.prisma;
      if (!prismaInstance) {
        prismaInstance = prisma;
      }

      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'User not authenticated');
      }

      const roleGuard = new RoleGuard(prismaInstance);
      const user = await roleGuard.loadUserWithPermissions(userId);
      
      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      const requireAll = options?.requireAll ?? true; // Default to requiring all permissions
      
      if (requireAll) {
        // User must have ALL specified permissions
        if (!roleGuard.hasAllPermissions(user, requiredPermissions)) {
          throw new HttpException(403, `Access denied: All of these permissions required: ${requiredPermissions.join(', ')}`);
        }
      } else {
        // User must have ANY of the specified permissions
        if (!roleGuard.hasAnyPermission(user, requiredPermissions)) {
          throw new HttpException(403, `Access denied: At least one of these permissions required: ${requiredPermissions.join(', ')}`);
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Helper middleware to check if user is admin (superadmin or admin)
 */
export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let prismaInstance = req.app.locals.prisma;
    if (!prismaInstance) {
      prismaInstance = prisma;
    }

    const userId = req.userId;

    if (!userId) {
      throw new HttpException(401, 'User not authenticated');
    }

    const roleGuard = new RoleGuard(prismaInstance);
    const user = await roleGuard.loadUserWithPermissions(userId);
    
    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    if (!roleGuard.isAdmin(user)) {
      throw new HttpException(403, 'Access denied: Administrator access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Helper middleware to check if user is superadmin
 */
export const superAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let prismaInstance = req.app.locals.prisma;
    if (!prismaInstance) {
      prismaInstance = prisma;
    }

    const userId = req.userId;

    if (!userId) {
      throw new HttpException(401, 'User not authenticated');
    }

    const roleGuard = new RoleGuard(prismaInstance);
    const user = await roleGuard.loadUserWithPermissions(userId);
    
    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    if (!roleGuard.isSuperAdmin(user)) {
      throw new HttpException(403, 'Access denied: Super administrator access required');
    }

    next();
  } catch (error) {
    next(error);
  }
};