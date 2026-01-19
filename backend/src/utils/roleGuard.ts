/**
 * Role Guard Utility
 * 
 * Centralized utilities for role and permission checking with hierarchy support
 */

import { PrismaClient, User, Role, Permission } from '@prisma/client';
import { ROLE_NAMES, ROLE_LEVELS, hasHigherOrEqualAuthority, canManageRole } from '../constants/roles';
import { PERMISSIONS, isValidPermission } from '../constants/permissions';
import { HttpException } from '../exceptions/HttpException';

/**
 * User with roles and permissions loaded
 */
export interface UserWithRolesAndPermissions extends User {
  userRoles: Array<{
    active: boolean;
    role: Role & {
      permissions: Permission[];
    };
  }>;
  userPermissions: Array<{
    active: boolean;
    permission: Permission;
  }>;
}

/**
 * Role Guard Service - handles all role and permission checking logic
 */
export class RoleGuard {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Load user with all roles and permissions
   */
  async loadUserWithPermissions(userId: number): Promise<UserWithRolesAndPermissions | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, active: true },
      include: {
        userRoles: {
          where: { active: true },
          include: {
            role: {
              include: {
                permissions: true
              }
            }
          }
        },
        userPermissions: {
          where: { active: true },
          include: {
            permission: true
          }
        }
      }
    });

    if (!user) return null;

    // Filter out inactive roles and permissions
    const filteredUser = {
      ...user,
      userRoles: user.userRoles.filter(ur => ur.role.active && ur.active),
      userPermissions: user.userPermissions.filter(up => up.permission.active && up.active)
    };

    // Filter out inactive permissions from roles
    filteredUser.userRoles = filteredUser.userRoles.map(ur => ({
      ...ur,
      role: {
        ...ur.role,
        permissions: ur.role.permissions.filter(p => p.active)
      }
    }));

    return filteredUser as UserWithRolesAndPermissions;
  }

  /**
   * Get all role names for a user
   */
  getUserRoles(user: UserWithRolesAndPermissions): string[] {
    return user.userRoles.map(ur => ur.role.name);
  }

  /**
   * Get all permissions for a user (from roles and direct assignments)
   */
  getUserPermissions(user: UserWithRolesAndPermissions): Set<string> {
    const permissions = new Set<string>();
    
    // Add role-based permissions
    for (const userRole of user.userRoles) {
      for (const permission of userRole.role.permissions) {
        permissions.add(permission.name);
      }
    }
    
    // Add direct permissions
    for (const userPermission of user.userPermissions) {
      permissions.add(userPermission.permission.name);
    }
    
    return permissions;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(user: UserWithRolesAndPermissions, roleName: string): boolean {
    return user.userRoles.some(ur => ur.role.name === roleName);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(user: UserWithRolesAndPermissions, roleNames: string[]): boolean {
    const userRoles = this.getUserRoles(user);
    return roleNames.some(role => userRoles.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(user: UserWithRolesAndPermissions, roleNames: string[]): boolean {
    const userRoles = this.getUserRoles(user);
    return roleNames.every(role => userRoles.includes(role));
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(user: UserWithRolesAndPermissions, permissionName: string): boolean {
    // Superadmin has all permissions
    if (this.isSuperAdmin(user)) {
      return true;
    }
    
    const userPermissions = this.getUserPermissions(user);
    return userPermissions.has(permissionName);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(user: UserWithRolesAndPermissions, permissionNames: string[]): boolean {
    // Superadmin has all permissions
    if (this.isSuperAdmin(user)) {
      return true;
    }
    
    const userPermissions = this.getUserPermissions(user);
    return permissionNames.some(permission => userPermissions.has(permission));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(user: UserWithRolesAndPermissions, permissionNames: string[]): boolean {
    // Superadmin has all permissions
    if (this.isSuperAdmin(user)) {
      return true;
    }
    
    const userPermissions = this.getUserPermissions(user);
    return permissionNames.every(permission => userPermissions.has(permission));
  }

  /**
   * Check if user is a superadmin
   */
  isSuperAdmin(user: UserWithRolesAndPermissions): boolean {
    return this.hasRole(user, ROLE_NAMES.SUPERADMIN);
  }

  /**
   * Check if user is an admin (superadmin or admin)
   */
  isAdmin(user: UserWithRolesAndPermissions): boolean {
    return this.hasAnyRole(user, [ROLE_NAMES.SUPERADMIN, ROLE_NAMES.ADMIN]);
  }

  /**
   * Check if user is staff (superadmin, admin, or moderator)
   */
  isStaff(user: UserWithRolesAndPermissions): boolean {
    return this.hasAnyRole(user, [ROLE_NAMES.SUPERADMIN, ROLE_NAMES.ADMIN, ROLE_NAMES.MODERATOR]);
  }

  /**
   * Get the highest role level for a user (lowest number = highest authority)
   */
  getHighestRoleLevel(user: UserWithRolesAndPermissions): number {
    let highestLevel = 999; // Default to very low authority
    
    for (const userRole of user.userRoles) {
      if (userRole.role.level < highestLevel) {
        highestLevel = userRole.role.level;
      }
    }
    
    return highestLevel;
  }

  /**
   * Check if user has authority to manage another user based on role hierarchy
   */
  canManageUser(actingUser: UserWithRolesAndPermissions, targetUser: UserWithRolesAndPermissions): boolean {
    // Superadmin can manage everyone
    if (this.isSuperAdmin(actingUser)) {
      return true;
    }
    
    // Cannot manage someone with equal or higher authority
    const actingLevel = this.getHighestRoleLevel(actingUser);
    const targetLevel = this.getHighestRoleLevel(targetUser);
    
    return actingLevel < targetLevel; // Lower level = higher authority
  }

  /**
   * Check if user can assign a specific role to another user
   */
  canAssignRole(actingUser: UserWithRolesAndPermissions, targetRoleName: string): boolean {
    // Must have MANAGE_USER_ROLES permission
    if (!this.hasPermission(actingUser, PERMISSIONS.MANAGE_USER_ROLES)) {
      return false;
    }
    
    // Superadmin can assign any role
    if (this.isSuperAdmin(actingUser)) {
      return true;
    }
    
    const actingRoles = this.getUserRoles(actingUser);
    
    // Check if any of the user's roles can manage the target role
    for (const actingRole of actingRoles) {
      if (canManageRole(actingRole, targetRoleName)) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Assert that user has a specific permission (throws HttpException if not)
   */
  assertPermission(user: UserWithRolesAndPermissions, permissionName: string): void {
    if (!this.hasPermission(user, permissionName)) {
      throw new HttpException(403, `Access denied: Required permission '${permissionName}' not found`);
    }
  }

  /**
   * Assert that user has any of the specified permissions (throws HttpException if not)
   */
  assertAnyPermission(user: UserWithRolesAndPermissions, permissionNames: string[]): void {
    if (!this.hasAnyPermission(user, permissionNames)) {
      throw new HttpException(403, `Access denied: At least one of these permissions required: ${permissionNames.join(', ')}`);
    }
  }

  /**
   * Assert that user has all of the specified permissions (throws HttpException if not)
   */
  assertAllPermissions(user: UserWithRolesAndPermissions, permissionNames: string[]): void {
    if (!this.hasAllPermissions(user, permissionNames)) {
      throw new HttpException(403, `Access denied: All of these permissions required: ${permissionNames.join(', ')}`);
    }
  }

  /**
   * Assert that user has a specific role (throws HttpException if not)
   */
  assertRole(user: UserWithRolesAndPermissions, roleName: string): void {
    if (!this.hasRole(user, roleName)) {
      throw new HttpException(403, `Access denied: Required role '${roleName}' not found`);
    }
  }

  /**
   * Assert that user has any of the specified roles (throws HttpException if not)
   */
  assertAnyRole(user: UserWithRolesAndPermissions, roleNames: string[]): void {
    if (!this.hasAnyRole(user, roleNames)) {
      throw new HttpException(403, `Access denied: One of these roles required: ${roleNames.join(', ')}`);
    }
  }

  /**
   * Assert that user is admin (throws HttpException if not)
   */
  assertAdmin(user: UserWithRolesAndPermissions): void {
    if (!this.isAdmin(user)) {
      throw new HttpException(403, 'Access denied: Administrator access required');
    }
  }

  /**
   * Assert that user is superadmin (throws HttpException if not)
   */
  assertSuperAdmin(user: UserWithRolesAndPermissions): void {
    if (!this.isSuperAdmin(user)) {
      throw new HttpException(403, 'Access denied: Super administrator access required');
    }
  }

  /**
   * Assert that user can manage another user (throws HttpException if not)
   */
  assertCanManageUser(actingUser: UserWithRolesAndPermissions, targetUser: UserWithRolesAndPermissions): void {
    if (!this.canManageUser(actingUser, targetUser)) {
      throw new HttpException(403, 'Access denied: You cannot manage users with equal or higher authority');
    }
  }

  /**
   * Assert that user can assign a role (throws HttpException if not)
   */
  assertCanAssignRole(actingUser: UserWithRolesAndPermissions, targetRoleName: string): void {
    if (!this.canAssignRole(actingUser, targetRoleName)) {
      throw new HttpException(403, `Access denied: You cannot assign the '${targetRoleName}' role`);
    }
  }
}

/**
 * Create a singleton instance with a prisma client
 */
export function createRoleGuard(prisma: PrismaClient): RoleGuard {
  return new RoleGuard(prisma);
}
