import { UserRole } from '@/types/auth';

/**
 * Get the appropriate dashboard redirect URL for users
 */
export function getDashboardRedirect(userRole: string | string[]): string {
  return '/profile';
}

/**
 * Check if user has specific role
 */
export function hasRole(userRoles: string[], requiredRole: UserRole): boolean {
  return userRoles.includes(requiredRole);
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(userRoles: string[], requiredRoles: UserRole[]): boolean {
  return requiredRoles.some(role => userRoles.includes(role));
}

/**
 * Get user's role
 */
export function getHighestRole(roles: string[]): UserRole {
  return 'user';
}
