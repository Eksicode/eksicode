#!/usr/bin/env tsx

/**
 * Test script to verify the seeding system works correctly
 */

import { execSync } from 'child_process';
import { join } from 'path';

const SEEDERS_DIR = join(__dirname, 'seeders');

async function testCompilation() {
  console.log('🔍 Testing TypeScript compilation...');
  
  try {
    // Test if TypeScript can compile the seeding system
    execSync(`npx tsc --noEmit --project ${join(SEEDERS_DIR, '..')}/tsconfig.json`, {
      cwd: join(SEEDERS_DIR, '..'),
      stdio: 'inherit'
    });
    console.log('✅ TypeScript compilation successful');
  } catch (error) {
    console.error('❌ TypeScript compilation failed');
    throw error;
  }
}

async function testModuleImports() {
  console.log('🔍 Testing module imports...');
  
  try {
    // Test dynamic imports
    const { Logger } = await import('./seeders/utils/logger');
    const logger = new Logger();
    logger.info('Logger import test successful');

    const { SeedOrchestrator } = await import('./seeders/orchestrator');
    console.log('✅ Module imports successful');
  } catch (error) {
    console.error('❌ Module imports failed:', error);
    throw error;
  }
}

async function testSeedingDryRun() {
  console.log('🔍 Testing seeding system (dry run)...');
  
  try {
    // Test if we can create the orchestrator without errors
    const { PrismaClient } = await import('@prisma/client');
    const { Logger } = await import('./seeders/utils/logger');
    const { SeedOrchestrator } = await import('./seeders/orchestrator');

    const prisma = new PrismaClient();
    const logger = new Logger();
    const orchestrator = new SeedOrchestrator(prisma, logger);

    // Get available seeders
    const seeders = orchestrator.getAvailableSeeders();
    console.log(`✅ Found ${seeders.length} available seeders:`);
    seeders.forEach(seeder => console.log(`   - ${seeder}`));

    await prisma.$disconnect();
    console.log('✅ Seeding system dry run successful');
  } catch (error) {
    console.error('❌ Seeding system dry run failed:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting seeding system tests...\n');

  try {
    await testModuleImports();
    console.log();
    
    await testSeedingDryRun();
    console.log();

    console.log('🎉 All tests passed! The seeding system is ready to use.');
    console.log('\n📋 Next steps:');
    console.log('1. Run: tsx prisma/seeders/index.ts');
    console.log('2. Or add to package.json: "seed": "tsx prisma/seeders/index.ts"');
    
  } catch (error) {
    console.error('\n💥 Tests failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
