/**
 * Simple test runner for the seeding system
 * This can be extended with proper testing framework later
 */

import { PrismaClient } from "@prisma/client";
import { Logger } from "./utils/logger";
import { DatabaseCleaner } from "./utils/database-cleaner";
import { SeedOrchestrator } from "./orchestrator";

class SeedTester {
  private prisma: PrismaClient;
  private logger: Logger;
  private cleaner: DatabaseCleaner;
  private orchestrator: SeedOrchestrator;

  constructor() {
    this.prisma = new PrismaClient();
    this.logger = new Logger();
    this.cleaner = new DatabaseCleaner(this.prisma, this.logger);
    this.orchestrator = new SeedOrchestrator(this.prisma, this.logger);
  }

  async runTests(): Promise<void> {
    this.logger.info("🧪 Starting seeding system tests...");

    try {
      // Test 1: Database cleanup
      await this.testDatabaseCleanup();

      // Test 2: Individual seeders
      await this.testIndividualSeeders();

      // Test 3: Full seeding process
      await this.testFullSeeding();

      // Test 4: Data validation
      await this.testDataValidation();

      this.logger.success("✅ All tests passed!");

    } catch (error) {
      this.logger.error("❌ Tests failed:", error);
      throw error;
    } finally {
      await this.prisma.$disconnect();
    }
  }

  private async testDatabaseCleanup(): Promise<void> {
    this.logger.info("Testing database cleanup...");
    
    try {
      await this.cleaner.cleanDatabase();
      this.logger.success("✓ Database cleanup test passed");
    } catch (error) {
      throw new Error(`Database cleanup test failed: ${error}`);
    }
  }

  private async testIndividualSeeders(): Promise<void> {
    this.logger.info("Testing individual seeders...");

    const testSeeders = ['PermissionSeeder', 'RoleSeeder', 'CategorySeeder'];
    
    try {
      await this.prisma.$transaction(async (tx) => {
        await this.orchestrator.seedSpecific(tx, testSeeders);
      });
      
      // Verify data was created
      const permissions = await this.prisma.permission.count();
      const roles = await this.prisma.role.count();
      const categories = await this.prisma.postCategory.count();

      if (permissions === 0 || roles === 0 || categories === 0) {
        throw new Error("Individual seeders did not create expected data");
      }

      this.logger.success("✓ Individual seeders test passed");
    } catch (error) {
      throw new Error(`Individual seeders test failed: ${error}`);
    }
  }

  private async testFullSeeding(): Promise<void> {
    this.logger.info("Testing full seeding process...");

    try {
      // Clean first
      await this.cleaner.cleanDatabase();
      
      // Run full seeding
      await this.prisma.$transaction(async (tx) => {
        await this.orchestrator.seedAll(tx);
      });

      this.logger.success("✓ Full seeding test passed");
    } catch (error) {
      throw new Error(`Full seeding test failed: ${error}`);
    }
  }

  private async testDataValidation(): Promise<void> {
    this.logger.info("Testing data validation...");

    try {
      // Check that required data exists
      const counts = await Promise.all([
        this.prisma.permission.count(),
        this.prisma.role.count(),
        this.prisma.user.count(),
        this.prisma.postCategory.count(),
        this.prisma.tag.count(),
      ]);

      const [permissions, roles, users, categories, tags] = counts;

      if (permissions < 5) throw new Error("Not enough permissions created");
      if (roles < 2) throw new Error("Not enough roles created");
      if (users < 1) throw new Error("No users created");
      if (categories < 3) throw new Error("Not enough categories created");
      if (tags < 5) throw new Error("Not enough tags created");

      // Check admin user exists
      const adminUser = await this.prisma.user.findUnique({
        where: { email: "admin@example.com" },
        include: { userRoles: { include: { role: true } } }
      });

      if (!adminUser) throw new Error("Admin user not found");
      if (adminUser.userRoles.length === 0) throw new Error("Admin user has no roles");

      this.logger.success("✓ Data validation test passed");
    } catch (error) {
      throw new Error(`Data validation test failed: ${error}`);
    }
  }

  async getSystemInfo(): Promise<void> {
    this.logger.info("📊 Seeding System Information:");
    
    const availableSeeders = this.orchestrator.getAvailableSeeders();
    this.logger.info(`Available seeders: ${availableSeeders.length}`);
    availableSeeders.forEach(seeder => {
      this.logger.info(`  - ${seeder}`);
    });

    // Database counts
    try {
      const counts = await Promise.all([
        this.prisma.permission.count(),
        this.prisma.role.count(),
        this.prisma.user.count(),
        this.prisma.postCategory.count(),
        this.prisma.tag.count(),
        this.prisma.post.count(),
        this.prisma.company.count(),
        this.prisma.job.count(),
      ]);

      const [permissions, roles, users, categories, tags, posts, companies, jobs] = counts;

      this.logger.info("📈 Current database counts:");
      this.logger.info(`  Permissions: ${permissions}`);
      this.logger.info(`  Roles: ${roles}`);
      this.logger.info(`  Users: ${users}`);
      this.logger.info(`  Categories: ${categories}`);
      this.logger.info(`  Tags: ${tags}`);
      this.logger.info(`  Posts: ${posts}`);
      this.logger.info(`  Companies: ${companies}`);
      this.logger.info(`  Jobs: ${jobs}`);
    } catch (error) {
      this.logger.warn("Could not fetch database counts:", error);
    }
  }
}

// Main execution
async function main() {
  const tester = new SeedTester();
  
  const args = process.argv.slice(2);
  const command = args[0] || 'test';

  switch (command) {
    case 'test':
      await tester.runTests();
      break;
    case 'info':
      await tester.getSystemInfo();
      break;
    default:
      console.log('Usage: tsx test-seeds.ts [test|info]');
      process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}
