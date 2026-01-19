/**
 * Centralized Permission Constants
 * 
 * This file defines all permissions used throughout the application.
 * Using constants ensures consistency and prevents typos.
 */

/**
 * Permission naming convention:
 * - Use SCREAMING_SNAKE_CASE
 * - Format: ACTION_RESOURCE
 * - Examples: CREATE_POST, DELETE_USER, MANAGE_SYSTEM
 */

// ==================== POST PERMISSIONS ====================
export const POST_PERMISSIONS = {
  CREATE_POST: 'CREATE_POST',
  UPDATE_POST: 'UPDATE_POST',
  DELETE_POST: 'DELETE_POST',
  APPROVE_POST: 'APPROVE_POST',
  VIEW_ALL_POSTS: 'VIEW_ALL_POSTS',
  PUBLISH_POST: 'PUBLISH_POST',
} as const;

// ==================== USER PERMISSIONS ====================
export const USER_PERMISSIONS = {
  VIEW_USERS: 'VIEW_USERS',
  VIEW_USER: 'VIEW_USER',
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  MANAGE_USER_ROLES: 'MANAGE_USER_ROLES',
  ASSIGN_ROLE: 'MANAGE_USER_ROLES', // Alias for backwards compatibility
  REMOVE_ROLE: 'MANAGE_USER_ROLES', // Alias for backwards compatibility
  VIEW_USER_ROLES: 'VIEW_USER',
  VIEW_USER_PERMISSIONS: 'VIEW_USER',
} as const;

// ==================== COMMENT PERMISSIONS ====================
export const COMMENT_PERMISSIONS = {
  DELETE_COMMENT: 'DELETE_COMMENT',
  MODERATE_COMMENTS: 'MODERATE_COMMENTS',
} as const;

// ==================== SYSTEM PERMISSIONS ====================
export const SYSTEM_PERMISSIONS = {
  MANAGE_SYSTEM: 'MANAGE_SYSTEM',
  VIEW_ADMIN_PANEL: 'VIEW_ADMIN_PANEL',
  MANAGE_PERMISSIONS: 'MANAGE_PERMISSIONS',
  VIEW_PERMISSIONS: 'VIEW_ADMIN_PANEL',
  CREATE_PERMISSION: 'MANAGE_PERMISSIONS',
  UPDATE_PERMISSION: 'MANAGE_PERMISSIONS',
  DELETE_PERMISSION: 'MANAGE_PERMISSIONS',
} as const;

// ==================== CONTENT PERMISSIONS ====================
export const CONTENT_PERMISSIONS = {
  MANAGE_CATEGORIES: 'MANAGE_CATEGORIES',
  MANAGE_TAGS: 'MANAGE_TAGS',
  MANAGE_PAGES: 'MANAGE_PAGES',
  MANAGE_MENUS: 'MANAGE_MENUS',
} as const;

// ==================== BUSINESS PERMISSIONS ====================
export const BUSINESS_PERMISSIONS = {
  MANAGE_COMPANIES: 'MANAGE_COMPANIES',
  MANAGE_JOBS: 'MANAGE_JOBS',
} as const;

// ==================== MEDIA PERMISSIONS ====================
export const MEDIA_PERMISSIONS = {
  MANAGE_MEDIA: 'MANAGE_MEDIA',
  DELETE_MEDIA: 'DELETE_MEDIA',
} as const;

// ==================== ROLE PERMISSIONS ====================
export const ROLE_PERMISSIONS = {
  VIEW_ROLES: 'VIEW_ADMIN_PANEL',
  CREATE_ROLE: 'MANAGE_PERMISSIONS',
  UPDATE_ROLE: 'MANAGE_PERMISSIONS',
  DELETE_ROLE: 'MANAGE_PERMISSIONS',
  ASSIGN_ROLE_PERMISSIONS: 'MANAGE_PERMISSIONS',
} as const;

// ==================== COMBINED PERMISSIONS ====================
/**
 * All permissions in a single object for easy access
 */
export const PERMISSIONS = {
  ...POST_PERMISSIONS,
  ...USER_PERMISSIONS,
  ...COMMENT_PERMISSIONS,
  ...SYSTEM_PERMISSIONS,
  ...CONTENT_PERMISSIONS,
  ...BUSINESS_PERMISSIONS,
  ...MEDIA_PERMISSIONS,
  ...ROLE_PERMISSIONS,
} as const;

/**
 * Type for all permission values
 */
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Array of all permission names (useful for validation)
 */
export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

/**
 * Get unique permission values (since we have aliases)
 */
export const UNIQUE_PERMISSIONS = [...new Set(ALL_PERMISSIONS)];

/**
 * Permission categories for organization
 */
export const PERMISSION_CATEGORIES = {
  POST: 'post',
  USER: 'user',
  COMMENT: 'comment',
  SYSTEM: 'system',
  CONTENT: 'content',
  BUSINESS: 'business',
  MEDIA: 'media',
  ROLE: 'role',
} as const;

/**
 * Map permissions to their categories
 */
export const PERMISSION_CATEGORY_MAP: Record<string, string> = {
  // Post permissions
  CREATE_POST: PERMISSION_CATEGORIES.POST,
  UPDATE_POST: PERMISSION_CATEGORIES.POST,
  DELETE_POST: PERMISSION_CATEGORIES.POST,
  APPROVE_POST: PERMISSION_CATEGORIES.POST,
  VIEW_ALL_POSTS: PERMISSION_CATEGORIES.POST,
  PUBLISH_POST: PERMISSION_CATEGORIES.POST,
  
  // User permissions
  VIEW_USERS: PERMISSION_CATEGORIES.USER,
  VIEW_USER: PERMISSION_CATEGORIES.USER,
  CREATE_USER: PERMISSION_CATEGORIES.USER,
  UPDATE_USER: PERMISSION_CATEGORIES.USER,
  DELETE_USER: PERMISSION_CATEGORIES.USER,
  MANAGE_USER_ROLES: PERMISSION_CATEGORIES.USER,
  
  // Comment permissions
  DELETE_COMMENT: PERMISSION_CATEGORIES.COMMENT,
  MODERATE_COMMENTS: PERMISSION_CATEGORIES.COMMENT,
  
  // System permissions
  MANAGE_SYSTEM: PERMISSION_CATEGORIES.SYSTEM,
  VIEW_ADMIN_PANEL: PERMISSION_CATEGORIES.SYSTEM,
  MANAGE_PERMISSIONS: PERMISSION_CATEGORIES.SYSTEM,
  
  // Content permissions
  MANAGE_CATEGORIES: PERMISSION_CATEGORIES.CONTENT,
  MANAGE_TAGS: PERMISSION_CATEGORIES.CONTENT,
  MANAGE_PAGES: PERMISSION_CATEGORIES.CONTENT,
  MANAGE_MENUS: PERMISSION_CATEGORIES.CONTENT,
  
  // Business permissions
  MANAGE_COMPANIES: PERMISSION_CATEGORIES.BUSINESS,
  MANAGE_JOBS: PERMISSION_CATEGORIES.BUSINESS,
  
  // Media permissions
  MANAGE_MEDIA: PERMISSION_CATEGORIES.MEDIA,
  DELETE_MEDIA: PERMISSION_CATEGORIES.MEDIA,
};

/**
 * Helper function to check if a permission exists
 */
export function isValidPermission(permission: string): permission is Permission {
  return UNIQUE_PERMISSIONS.includes(permission as Permission);
}

/**
 * Helper function to get permission category
 */
export function getPermissionCategory(permission: string): string | undefined {
  return PERMISSION_CATEGORY_MAP[permission];
}
