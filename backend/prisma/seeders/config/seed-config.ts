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
    { name: "CREATE_POST", description: "Can create posts" },
    { name: "UPDATE_POST", description: "Can update posts" },
    { name: "DELETE_POST", description: "Can delete posts" },
    { name: "APPROVE_POST", description: "Can approve posts" },
    { name: "VIEW_ALL_POSTS", description: "Can view all posts including drafts" },
    
    // User permissions
    { name: "VIEW_USERS", description: "Can view all users" },
    { name: "VIEW_USER", description: "Can view user details" },
    { name: "CREATE_USER", description: "Can create users" },
    { name: "UPDATE_USER", description: "Can update users" },
    { name: "DELETE_USER", description: "Can delete users" },
    { name: "MANAGE_USER_ROLES", description: "Can assign/remove user roles" },
    
    // Comment permissions
    { name: "DELETE_COMMENT", description: "Can delete comments" },
    { name: "MODERATE_COMMENTS", description: "Can moderate comments" },
    
    // System permissions
    { name: "MANAGE_SYSTEM", description: "Can manage system settings" },
    { name: "VIEW_ADMIN_PANEL", description: "Can access admin panel" },
    { name: "MANAGE_PERMISSIONS", description: "Can manage permissions and roles" },
    
    // Content permissions
    { name: "MANAGE_CATEGORIES", description: "Can manage categories" },
    { name: "MANAGE_TAGS", description: "Can manage tags" },
    { name: "MANAGE_PAGES", description: "Can manage static pages" },
    { name: "MANAGE_MENUS", description: "Can manage menu items" },
    
    // Job/Company permissions
    { name: "MANAGE_COMPANIES", description: "Can manage companies" },
    { name: "MANAGE_JOBS", description: "Can manage job postings" },
    
    // Media permissions
    { name: "MANAGE_MEDIA", description: "Can manage media files" },
    { name: "DELETE_MEDIA", description: "Can delete media files" },
  ],

  // Default roles
  roles: [
    {
      name: "superadmin",
      description: "Super Administrator with complete system access",
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
