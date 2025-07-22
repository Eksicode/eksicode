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
    { name: "CREATE_POST", description: "Can create posts" },
    { name: "DELETE_POST", description: "Can delete posts" },
    { name: "VIEW_USERS", description: "Can view all users" },
    { name: "VIEW_USER", description: "Can view user details" },
    { name: "CREATE_USER", description: "Can create users" },
    { name: "UPDATE_USER", description: "Can update users" },
    { name: "DELETE_USER", description: "Can delete users" },
  ],

  // Default roles
  roles: [
    {
      name: "superadmin",
      description: "Administrator with full access",
      permissions: ["CREATE_POST", "DELETE_POST", "VIEW_USERS", "VIEW_USER", "CREATE_USER", "UPDATE_USER", "DELETE_USER"]
    },
    {
      name: "admin",
      description: "Administrator with limited access",
      permissions: ["CREATE_POST", "DELETE_POST", "VIEW_USERS", "VIEW_USER", "CREATE_USER", "UPDATE_USER"]
    },
    {
      name: "user",
      description: "Regular user with limited access",
      permissions: ["CREATE_POST", "VIEW_USER"]
    }
  ],

  // Default admin user
  defaultAdmin: {
    id: 1,
    email: "admin@example.com",
    username: "admin",
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
