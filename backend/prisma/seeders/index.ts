import { PrismaClient } from "@prisma/client";

// Dynamically import to avoid circular dependencies
async function main() {
  const prisma = new PrismaClient();

  try {
    console.log("🌱 Starting database seeding...");
    
    // Import modules dynamically
    const { Logger } = await import("./utils/logger");
    const { DatabaseCleaner } = await import("./utils/database-cleaner");
    const { SeedOrchestrator } = await import("./orchestrator");

    const logger = new Logger();
    const cleaner = new DatabaseCleaner(prisma, logger);
    const orchestrator = new SeedOrchestrator(prisma, logger);
    
    // Clean database first
    await cleaner.cleanDatabase();
    
    // Run seeding in transaction for data consistency
    await prisma.$transaction(async (tx) => {
      await orchestrator.seedAll(tx);
    }, {
      maxWait: 30000, // 30 seconds
      timeout: 30000, // 30 seconds
    });
    
    logger.success("✅ Database seeding completed successfully!");
    
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("🔌 Database connection closed");
  }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Export main function for use by legacy seed.ts
export { main };

// Run if this file is executed directly
if (require.main === module) {
  main();
}
