/**
 * Seeding configuration and constants
 */
export const SEED_CONFIG = {
  // User configuration
  defaultAdminPassword: "eksicode2025**",
  bcryptRounds: 10,

  // Batch sizes for bulk operations
  batchSizes: {
    users: 50,
    posts: 100,
    companies: 20,
    jobs: 50,
  },

  // Default categories and tags
  defaultCategories: [
    { id: 0, name: "Technology" },
    { id: 1, name: "Programming" },
    { id: 2, name: "Web Development" },
    { id: 3, name: "Data Science" }
  ],

  defaultTags: [
    { id: 1, name: "javascript" },
    { id: 2, name: "react" },
    { id: 3, name: "nextjs" },
    { id: 4, name: "typescript" },
    { id: 5, name: "prisma" },
    { id: 6, name: "database" }
  ],

  // Menu categories
  menuCategories: ["main", "footer", "dashboard", "admin"],

  // Default permissions
  permissions: [
    // Post permissions
    { name: "CREATE_POST", description: "Can create posts", category: "content", resource: "post", action: "create" },
    { name: "UPDATE_POST", description: "Can update posts", category: "content", resource: "post", action: "update" },
    { name: "DELETE_POST", description: "Can delete posts", category: "content", resource: "post", action: "delete" },
    { name: "APPROVE_POST", description: "Can approve posts", category: "content", resource: "post", action: "approve" },
    { name: "VIEW_ALL_POSTS", description: "Can view all posts including drafts", category: "content", resource: "post", action: "view_all" },
    
    // User permissions
    { name: "VIEW_USERS", description: "Can view all users", category: "user_management", resource: "user", action: "view_all" },
    { name: "VIEW_USER", description: "Can view user details", category: "user_management", resource: "user", action: "view" },
    { name: "CREATE_USER", description: "Can create users", category: "user_management", resource: "user", action: "create" },
    { name: "UPDATE_USER", description: "Can update users", category: "user_management", resource: "user", action: "update" },
    { name: "DELETE_USER", description: "Can delete users", category: "user_management", resource: "user", action: "delete" },
    { name: "MANAGE_USER_ROLES", description: "Can assign/remove user roles", category: "user_management", resource: "user_role", action: "manage" },
    
    // Comment permissions
    { name: "DELETE_COMMENT", description: "Can delete comments", category: "content", resource: "comment", action: "delete" },
    { name: "MODERATE_COMMENTS", description: "Can moderate comments", category: "content", resource: "comment", action: "moderate" },
    
    // System permissions
    { name: "MANAGE_SYSTEM", description: "Can manage system settings", category: "system", resource: "system", action: "manage" },
    { name: "VIEW_ADMIN_PANEL", description: "Can access admin panel", category: "system", resource: "admin_panel", action: "view" },
    { name: "MANAGE_PERMISSIONS", description: "Can manage permissions and roles", category: "system", resource: "permission", action: "manage" },
    
    // Content permissions
    { name: "MANAGE_CATEGORIES", description: "Can manage categories", category: "content", resource: "category", action: "manage" },
    { name: "MANAGE_TAGS", description: "Can manage tags", category: "content", resource: "tag", action: "manage" },
    { name: "MANAGE_PAGES", description: "Can manage static pages", category: "content", resource: "page", action: "manage" },
    { name: "MANAGE_MENUS", description: "Can manage menu items", category: "content", resource: "menu", action: "manage" },
    
    // Job/Company permissions
    { name: "MANAGE_COMPANIES", description: "Can manage companies", category: "business", resource: "company", action: "manage" },
    { name: "MANAGE_JOBS", description: "Can manage job postings", category: "business", resource: "job", action: "manage" },
    
    // Media permissions
    { name: "MANAGE_MEDIA", description: "Can manage media files", category: "media", resource: "media", action: "manage" },
    { name: "DELETE_MEDIA", description: "Can delete media files", category: "media", resource: "media", action: "delete" },
  ],

  // Default roles with hierarchy levels
  roles: [
    {
      name: "superadmin",
      description: "Super Administrator with complete system access",
      level: 0, // Highest authority
      permissions: [
        "CREATE_POST", "UPDATE_POST", "DELETE_POST", "APPROVE_POST", "VIEW_ALL_POSTS",
        "VIEW_USERS", "VIEW_USER", "CREATE_USER", "UPDATE_USER", "DELETE_USER", "MANAGE_USER_ROLES",
        "DELETE_COMMENT", "MODERATE_COMMENTS",
        "MANAGE_SYSTEM", "VIEW_ADMIN_PANEL", "MANAGE_PERMISSIONS",
        "MANAGE_CATEGORIES", "MANAGE_TAGS", "MANAGE_PAGES", "MANAGE_MENUS",
        "MANAGE_COMPANIES", "MANAGE_JOBS",
        "MANAGE_MEDIA", "DELETE_MEDIA"
      ]
    },
    {
      name: "admin",
      description: "Administrator with content and user management access",
      level: 10, // High authority, but below superadmin
      permissions: [
        "CREATE_POST", "UPDATE_POST", "DELETE_POST", "APPROVE_POST", "VIEW_ALL_POSTS",
        "VIEW_USERS", "VIEW_USER", "CREATE_USER", "UPDATE_USER",
        "DELETE_COMMENT", "MODERATE_COMMENTS",
        "VIEW_ADMIN_PANEL",
        "MANAGE_CATEGORIES", "MANAGE_TAGS", "MANAGE_PAGES", "MANAGE_MENUS",
        "MANAGE_COMPANIES", "MANAGE_JOBS",
        "MANAGE_MEDIA"
      ]
    },
    {
      name: "moderator",
      description: "Content moderator with limited management access",
      level: 20, // Medium authority
      permissions: [
        "CREATE_POST", "UPDATE_POST", "APPROVE_POST", "VIEW_ALL_POSTS",
        "VIEW_USER",
        "DELETE_COMMENT", "MODERATE_COMMENTS",
        "VIEW_ADMIN_PANEL",
        "MANAGE_CATEGORIES", "MANAGE_TAGS"
      ]
    },
    {
      name: "user",
      description: "Regular user with basic access",
      level: 100, // Lowest authority
      permissions: ["CREATE_POST", "VIEW_USER"]
    }
  ],

  // Default admin users
  defaultUsers: [
    {
      email: "superadmin@eksicode.com",
      username: "superadmin",
      firstName: "Super",
      lastName: "Admin",
      role: "superadmin",
      verified: true,
      emailVerified: true
    },
    {
      email: "admin@eksicode.com", 
      username: "admin",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
      verified: true,
      emailVerified: true
    },
    {
      email: "moderator@eksicode.com",
      username: "moderator",
      firstName: "Content",
      lastName: "Moderator", 
      role: "moderator",
      verified: true,
      emailVerified: true
    }
  ],

  // Legacy default admin (kept for backward compatibility)
  defaultAdmin: {
    email: "superadmin@eksicode.com",
    username: "superadmin",
    role: "superadmin"
  }
} as const;

/**
 * Seeding error types
 */
export class SeedingError extends Error {
  constructor(
    message: string,
    public readonly operation: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'SeedingError';
  }
}

/**
 * Validation utilities
 */
export class SeedValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validateUsername(username: string): boolean {
    return username.length >= 3 && username.length <= 50;
  }

  static validateRequired<T>(value: T, fieldName: string): T {
    if (value === null || value === undefined || value === '') {
      throw new SeedingError(`${fieldName} is required`, 'validation');
    }
    return value;
  }
}
