/**
 * Centralized Role Constants
 * 
 * This file defines all roles and their hierarchy used throughout the application.
 */

/**
 * Role names as constants
 */
export const ROLE_NAMES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
} as const;

/**
 * Type for role names
 */
export type RoleName = typeof ROLE_NAMES[keyof typeof ROLE_NAMES];

/**
 * Role hierarchy levels (lower number = higher authority)
 * 0 = Highest level (superadmin)
 * 100 = Lowest level (regular user)
 */
export const ROLE_LEVELS = {
  [ROLE_NAMES.SUPERADMIN]: 0,
  [ROLE_NAMES.ADMIN]: 10,
  [ROLE_NAMES.MODERATOR]: 20,
  [ROLE_NAMES.USER]: 100,
} as const;

/**
 * Role descriptions
 */
export const ROLE_DESCRIPTIONS = {
  [ROLE_NAMES.SUPERADMIN]: 'Super Administrator with complete system access',
  [ROLE_NAMES.ADMIN]: 'Administrator with content and user management access',
  [ROLE_NAMES.MODERATOR]: 'Content moderator with limited management access',
  [ROLE_NAMES.USER]: 'Regular user with basic access',
} as const;

/**
 * Helper function to check if a role exists
 */
export function isValidRole(role: string): role is RoleName {
  return Object.values(ROLE_NAMES).includes(role as RoleName);
}

/**
 * Helper function to get role level
 */
export function getRoleLevel(role: string): number | undefined {
  return ROLE_LEVELS[role as RoleName];
}

/**
 * Helper function to check if roleA has higher or equal authority than roleB
 */
export function hasHigherOrEqualAuthority(roleA: string, roleB: string): boolean {
  const levelA = getRoleLevel(roleA);
  const levelB = getRoleLevel(roleB);
  
  if (levelA === undefined || levelB === undefined) {
    return false;
  }
  
  return levelA <= levelB; // Lower level number = higher authority
}

/**
 * Helper function to check if a user role can manage a target role
 */
export function canManageRole(userRole: string, targetRole: string): boolean {
  // Superadmin can manage everyone
  if (userRole === ROLE_NAMES.SUPERADMIN) {
    return true;
  }
  
  // Admin can manage moderators and users, but not other admins or superadmins
  if (userRole === ROLE_NAMES.ADMIN) {
    const manageableRoles: string[] = [ROLE_NAMES.MODERATOR, ROLE_NAMES.USER];
    return manageableRoles.includes(targetRole);
  }
  
  // Moderators and users cannot manage roles
  return false;
}

/**
 * Get all roles sorted by hierarchy (highest authority first)
 */
export function getRolesByHierarchy(): RoleName[] {
  return Object.entries(ROLE_LEVELS)
    .sort(([, levelA], [, levelB]) => levelA - levelB)
    .map(([role]) => role as RoleName);
}

/**
 * Array of all role names
 */
export const ALL_ROLES = Object.values(ROLE_NAMES);

/**
 * Admin roles (superadmin and admin)
 */
export const ADMIN_ROLES = [ROLE_NAMES.SUPERADMIN, ROLE_NAMES.ADMIN] as const;

/**
 * Staff roles (superadmin, admin, and moderator)
 */
export const STAFF_ROLES = [ROLE_NAMES.SUPERADMIN, ROLE_NAMES.ADMIN, ROLE_NAMES.MODERATOR] as const;
