import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import { prisma } from "../config/database";

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

export const roleMiddleware = (requiredRoles?: string[]) => {
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

      // Fetch user's roles and their associated permissions (only once)
      const userRoles = await prismaInstance.userRole.findMany({
        where: { userId },
        include: {
          role: {
            include: {
              permissions: true
            }
          }
        }
      }) as unknown as UserRoleWithRelations[];

      // Extract user role names and permissions once (for reuse)
      const userRoleNames = getUserRoleNames(userRoles);
      const userPermissions = getUserPermissions(userRoles);

      // If specific roles are required via parameter
      if (requiredRoles && requiredRoles.length > 0) {
        if (!hasRequiredRole(userRoleNames, requiredRoles)) {
          throw new HttpException(403, 'Access denied: Required role not found');
        }
      } else {
        // Check endpoint-specific access requirements from database
        const path = req.baseUrl + req.path;
        const method = req.method.toLowerCase();

        const endpointAccess = await prismaInstance.endpointAccess.findFirst({
          where: { path, method },
          include: {
            roles: true,         // Changed from requiredRoles
            permissions: true    // Changed from requiredPermissions
          }
        }) as unknown as EndpointAccessWithRelations | null;

        if (endpointAccess) {
          // Check role-based access
          if (endpointAccess.roles && endpointAccess.roles.length > 0) {
            const endpointRoleNames = endpointAccess.roles.map(role => role.name.toLowerCase());
            if (!hasAnyRole(userRoleNames, endpointRoleNames)) {
              throw new HttpException(403, 'Access denied: Required role not found');
            }
          }

          // Check permission-based access
          if (endpointAccess.permissions && endpointAccess.permissions.length > 0) {
            const requiredPermissionNames = endpointAccess.permissions.map(
              permission => permission.name.toLowerCase()
            );
            
            if (!hasAllPermissions(userPermissions, requiredPermissionNames)) {
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
 * Extract user role names from user roles
 * @param userRoles Array of user roles with relations
 * @returns Array of lowercase role names
 */
function getUserRoleNames(userRoles: UserRoleWithRelations[]): string[] {
  return userRoles.map(ur => ur.role.name.toLowerCase());
}

/**
 * Extract user permissions from user roles
 * @param userRoles Array of user roles with relations
 * @returns Set of lowercase permission names
 */
function getUserPermissions(userRoles: UserRoleWithRelations[]): Set<string> {
  return new Set(
    userRoles.flatMap(ur =>
      ur.role.permissions.map(permission =>
        permission.name.toLowerCase()
      )
    )
  );
}

/**
 * Check if user has any of the required roles
 * @param userRoleNames Array of user role names
 * @param requiredRoles Array of required role names
 * @returns Boolean indicating if user has any required role
 */
function hasRequiredRole(userRoleNames: string[], requiredRoles: string[]): boolean {
  return requiredRoles.some(role => userRoleNames.includes(role.toLowerCase()));
}

/**
 * Check if user has any of the endpoint roles
 * @param userRoleNames Array of user role names
 * @param endpointRoleNames Array of endpoint role names
 * @returns Boolean indicating if user has any endpoint role
 */
function hasAnyRole(userRoleNames: string[], endpointRoleNames: string[]): boolean {
  return endpointRoleNames.some(role => userRoleNames.includes(role));
}

/**
 * Check if user has all required permissions
 * @param userPermissions Set of user permission names
 * @param requiredPermissionNames Array of required permission names
 * @returns Boolean indicating if user has all required permissions
 */
function hasAllPermissions(userPermissions: Set<string>, requiredPermissionNames: string[]): boolean {
  return requiredPermissionNames.every(permission => userPermissions.has(permission));
}