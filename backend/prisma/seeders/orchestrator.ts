import { PrismaClient, Prisma } from "@prisma/client";
import { Logger } from "./utils/logger";
import { SEED_CONFIG, SeedingError } from "./config/seed-config";
import {
  BaseSeeder,
  PermissionSeeder,
  RoleSeeder,
  UserSeeder,
  CategorySeeder,
  PostSeeder,
  CompanySeeder,
  JobSeeder,
  TelegramSeeder,
  MenuSeeder,
  PageSeeder,
  SourceSeeder,
  EndpointAccessSeeder,
  MediaSeeder,
  CommentSeeder,
  PostLikeSeeder,
  NotificationSeeder
} from "./seeders";

/**
 * Main seeding orchestrator
 * Coordinates all seeding operations in the correct order
 */
export class SeedOrchestrator {
  private readonly seeders: BaseSeeder[];

  constructor(
    private readonly prisma: PrismaClient,
    private readonly logger: Logger
  ) {
    // Initialize seeders in dependency order
    this.seeders = [
      new PermissionSeeder(prisma, logger),
      new RoleSeeder(prisma, logger),
      new UserSeeder(prisma, logger),
      new CategorySeeder(prisma, logger),
      new MediaSeeder(prisma, logger),
      new PostSeeder(prisma, logger),
      new CompanySeeder(prisma, logger),
      new JobSeeder(prisma, logger),
      new TelegramSeeder(prisma, logger),
      new MenuSeeder(prisma, logger),
      new PageSeeder(prisma, logger),
      new SourceSeeder(prisma, logger),
      new EndpointAccessSeeder(prisma, logger),
      new CommentSeeder(prisma, logger),
      new PostLikeSeeder(prisma, logger),
      new NotificationSeeder(prisma, logger),
    ];
  }

  /**
   * Run all seeders in sequence
   */
  async seedAll(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`🌱 Starting seeding process with ${this.seeders.length} seeders...`);

    const startTime = Date.now();
    let completedSeeders = 0;

    try {
      for (const seeder of this.seeders) {
        const seederStartTime = Date.now();
        
        try {
          this.logger.info(`▶️  Running ${seeder.constructor.name}...`);
          await seeder.seed(tx);
          
          const duration = Date.now() - seederStartTime;
          completedSeeders++;
          
          this.logger.success(`✅ ${seeder.constructor.name} completed in ${duration}ms`);
          
        } catch (error) {
          const duration = Date.now() - seederStartTime;
          this.logger.error(`❌ ${seeder.constructor.name} failed after ${duration}ms`, error);
          
          throw new SeedingError(
            `Seeder ${seeder.constructor.name} failed`,
            'seeding',
            error instanceof Error ? error : new Error(String(error))
          );
        }
      }

      const totalDuration = Date.now() - startTime;
      
      // Reset sequences to continue from current max IDs
      await this.resetSequencesToMaxIds(tx);
      
      this.logger.success(
        `🎉 All ${completedSeeders} seeders completed successfully in ${totalDuration}ms`
      );

    } catch (error) {
      const totalDuration = Date.now() - startTime;
      this.logger.error(
        `💥 Seeding failed after ${totalDuration}ms. Completed ${completedSeeders}/${this.seeders.length} seeders.`,
        error
      );
      throw error;
    }
  }

  /**
   * Run specific seeders by name
   */
  async seedSpecific(tx: Prisma.TransactionClient, seederNames: string[]): Promise<void> {
    this.logger.info(`🎯 Running specific seeders: ${seederNames.join(', ')}`);

    const selectedSeeders = this.seeders.filter(seeder =>
      seederNames.includes(seeder.constructor.name)
    );

    if (selectedSeeders.length !== seederNames.length) {
      const found = selectedSeeders.map(s => s.constructor.name);
      const missing = seederNames.filter(name => !found.includes(name));
      throw new SeedingError(
        `Seeders not found: ${missing.join(', ')}`,
        'configuration'
      );
    }

    for (const seeder of selectedSeeders) {
      try {
        this.logger.info(`▶️  Running ${seeder.constructor.name}...`);
        await seeder.seed(tx);
        this.logger.success(`✅ ${seeder.constructor.name} completed`);
      } catch (error) {
        this.logger.error(`❌ ${seeder.constructor.name} failed`, error);
        throw error;
      }
    }
  }

  /**
   * Get list of available seeders
   */
  getAvailableSeeders(): string[] {
    return this.seeders.map(seeder => seeder.constructor.name);
  }

  /**
   * Reset PostgreSQL sequences to continue from current maximum IDs
   */
  private async resetSequencesToMaxIds(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info("🔄 Resetting sequences to current max IDs...");
    
    try {
      const sequenceUpdates = [
        { table: 'users', sequence: 'users_id_seq' },
        { table: 'roles', sequence: 'roles_id_seq' },
        { table: 'permissions', sequence: 'permissions_id_seq' },
        { table: 'user_roles', sequence: 'user_roles_id_seq' },
        { table: 'posts', sequence: 'posts_id_seq' },
        { table: 'companies', sequence: 'companies_id_seq' },
        { table: 'jobs', sequence: 'jobs_id_seq' },
        { table: 'post_categories', sequence: 'post_categories_id_seq' },
        { table: 'tags', sequence: 'tags_id_seq' },
        { table: 'telegram_groups', sequence: 'telegram_groups_id_seq' },
        { table: 'menus', sequence: 'menus_id_seq' },
        { table: 'menu_categories', sequence: 'menu_categories_id_seq' },
        { table: 'pages', sequence: 'pages_id_seq' },
        { table: 'page_categories', sequence: 'page_categories_id_seq' },
        { table: 'sources', sequence: 'sources_id_seq' },
        { table: 'media', sequence: 'media_id_seq' },
        { table: 'comments', sequence: 'comments_id_seq' },
        { table: 'post_likes', sequence: 'post_likes_id_seq' },
        { table: 'notifications', sequence: 'notifications_id_seq' },
      ];

      for (const { table, sequence } of sequenceUpdates) {
        try {
          await tx.$executeRawUnsafe(`
            SELECT setval('${sequence}', COALESCE((SELECT MAX(id) FROM ${table}), 1), true);
          `);
          this.logger.debug(`Reset ${sequence} for table ${table}`);
        } catch (error) {
          // Sequence or table might not exist, which is fine
          this.logger.debug(`Could not reset ${sequence}: ${error}`);
        }
      }
      
      this.logger.success("✅ Sequences reset to continue from max IDs");
    } catch (error) {
      this.logger.error("Failed to reset sequences", error);
      // Don't throw error as this is not critical for seeding functionality
    }
  }
}
