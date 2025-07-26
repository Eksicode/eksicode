import { UserRole } from '@/types/auth';

/**
 * Get the appropriate dashboard redirect URL based on user role
 */
export function getDashboardRedirect(userRole: string | string[]): string {
  const roles = Array.isArray(userRole) ? userRole : [userRole];
  
  if (roles.includes('superadmin') || roles.includes('admin')) {
    return '/admin';
  }
  
  return '/profile';
}

/**
 * Check if user has admin privileges
 */
export function isAdminUser(roles: string[]): boolean {
  return roles.includes('admin') || roles.includes('superadmin');
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
 * Get user's highest privilege role
 */
export function getHighestRole(roles: string[]): UserRole {
  if (roles.includes('superadmin')) return 'superadmin';
  if (roles.includes('admin')) return 'admin';
  return 'user';
}
