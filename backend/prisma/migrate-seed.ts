#!/usr/bin/env node

/**
 * Migration script to move from old seed.ts to new modular structure
 * This script can be run to gradually migrate existing seeding
 */

import { execSync } from 'child_process';
import { existsSync, copyFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

const BACKUP_DIR = './backup-seed';
const NEW_SEEDERS_DIR = './seeders';

function createBackup() {
  console.log('📦 Creating backup of existing seed files...');
  
  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Backup existing seed.ts
  if (existsSync('./seed.ts')) {
    copyFileSync('./seed.ts', join(BACKUP_DIR, 'seed.ts.backup'));
    console.log('✅ Backed up seed.ts');
  }

  // Backup data files
  const dataFiles = [
    'companiesData.ts',
    'endpointAccessData.ts', 
    'jobsData.ts',
    'menuItemsData.ts',
    'pagesData.ts',
    'postsData.ts',
    'sourcesData.ts',
    'telegramGroupsData.ts'
  ];

  dataFiles.forEach(file => {
    if (existsSync(`./${file}`)) {
      copyFileSync(`./${file}`, join(BACKUP_DIR, file));
      console.log(`✅ Backed up ${file}`);
    }
  });
}

function validateNewStructure() {
  console.log('🔍 Validating new seeder structure...');
  
  const requiredFiles = [
    'seeders/index.ts',
    'seeders/orchestrator.ts',
    'seeders/utils/logger.ts',
    'seeders/utils/database-cleaner.ts',
    'seeders/config/seed-config.ts'
  ];

  const missingFiles = requiredFiles.filter(file => !existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Missing required files:', missingFiles);
    return false;
  }

  console.log('✅ New seeder structure is valid');
  return true;
}

function updatePackageJson() {
  console.log('📝 Updating package.json scripts...');
  
  try {
    const packageJson = require('../package.json');
    
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    // Add new seeding scripts
    packageJson.scripts['seed'] = 'tsx prisma/seeders/index.ts';
    packageJson.scripts['seed:dev'] = 'NODE_ENV=development tsx prisma/seeders/index.ts';
    packageJson.scripts['seed:clean'] = 'tsx -e "import {DatabaseCleaner} from \'./prisma/seeders/utils/database-cleaner\'; import {PrismaClient} from \'@prisma/client\'; import {Logger} from \'./prisma/seeders/utils/logger\'; const prisma = new PrismaClient(); const logger = new Logger(); const cleaner = new DatabaseCleaner(prisma, logger); cleaner.cleanDatabase().then(() => prisma.$disconnect());"';
    
    // Backup old seed script
    if (packageJson.scripts['seed']) {
      packageJson.scripts['seed:old'] = packageJson.scripts['seed'];
    }

    require('fs').writeFileSync('../package.json', JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json');
  } catch (error) {
    console.warn('⚠️  Could not update package.json:', error);
  }
}

function main() {
  console.log('🚀 Starting seed migration...\n');

  try {
    createBackup();
    
    if (!validateNewStructure()) {
      console.error('❌ Migration failed - invalid structure');
      process.exit(1);
    }

    updatePackageJson();

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the new seeding: npm run seed');
    console.log('2. If everything works, you can remove the old seed.ts');
    console.log('3. Consider adding the new structure to your CI/CD pipeline');
    console.log(`4. Old files are backed up in: ${BACKUP_DIR}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
