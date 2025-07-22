import { PrismaClient } from "@prisma/client";
import { Logger } from "./logger";

/**
 * Database cleaner utility
 * Handles safe database cleanup with proper order of operations
 */
export class DatabaseCleaner {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: Logger
  ) {}

  /**
   * Clean database in the correct order to avoid foreign key constraint violations
   */
  async cleanDatabase(): Promise<void> {
    this.logger.info("🧹 Cleaning database...");

    try {
      // Order matters due to foreign key constraints
      const cleanupOrder = [
        { model: 'postLike', name: 'Post Likes' },
        { model: 'comment', name: 'Comments' },
        { model: 'notification', name: 'Notifications' },
        { model: 'post', name: 'Posts' },
        { model: 'job', name: 'Jobs' },
        { model: 'source', name: 'Sources' },
        { model: 'userRole', name: 'User Roles' },
        { model: 'user', name: 'Users' },
        { model: 'endpointAccess', name: 'Endpoint Access' },
        { model: 'role', name: 'Roles' },
        { model: 'permission', name: 'Permissions' },
        { model: 'tag', name: 'Tags' },
        { model: 'postCategory', name: 'Post Categories' },
        { model: 'menu', name: 'Menus' },
        { model: 'menuCategory', name: 'Menu Categories' },
        { model: 'page', name: 'Pages' },
        { model: 'pageCategory', name: 'Page Categories' },
        { model: 'telegramGroup', name: 'Telegram Groups' },
        { model: 'company', name: 'Companies' },
      ];

      for (const { model, name } of cleanupOrder) {
        try {
          const result = await (this.prisma as any)[model].deleteMany({});
          this.logger.debug(`Deleted ${result.count} ${name}`);
        } catch (error) {
          this.logger.warn(`Failed to delete ${name}:`, error);
          // Continue with other deletions
        }
      }

      this.logger.success("Database cleaned successfully");
    } catch (error) {
      this.logger.error("Failed to clean database", error);
      throw error;
    }
  }

  /**
   * Reset auto-increment sequences (useful for testing)
   */
  async resetSequences(): Promise<void> {
    this.logger.info("🔄 Resetting sequences...");
    
    try {
      // Reset sequences for PostgreSQL
      const sequences = [
        'users_id_seq',
        'roles_id_seq',
        'permissions_id_seq',
        'posts_id_seq',
        'companies_id_seq',
        'jobs_id_seq'
      ];

      for (const sequence of sequences) {
        try {
          await this.prisma.$executeRawUnsafe(`ALTER SEQUENCE ${sequence} RESTART WITH 1;`);
        } catch (error) {
          // Sequence might not exist, which is fine
          this.logger.debug(`Sequence ${sequence} not found or already reset`);
        }
      }
      
      this.logger.success("Sequences reset successfully");
    } catch (error) {
      this.logger.error("Failed to reset sequences", error);
      throw error;
    }
  }
}
