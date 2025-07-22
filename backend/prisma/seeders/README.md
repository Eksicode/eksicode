# Database Seeding System

This directory contains a modular, robust database seeding system for the EksiCode project.

## Overview

The seeding system has been refactored from a monolithic `seed.ts` file into a modular architecture that provides:

- 🔧 **Modular Architecture**: Each entity type has its own seeder
- 🛡️ **Error Handling**: Comprehensive error handling and recovery
- 📊 **Logging**: Detailed logging with timestamps and progress tracking
- 🔄 **Transaction Support**: Database consistency with transaction rollback
- ⚡ **Batch Processing**: Efficient bulk operations
- 🎯 **Type Safety**: Full TypeScript support with proper typing
- 🧪 **Testability**: Easy to test individual seeders

## Directory Structure

```
seeders/
├── index.ts                    # Main entry point
├── orchestrator.ts            # Coordinates all seeding operations
├── migrate-seed.ts            # Migration script from old to new system
├── config/
│   └── seed-config.ts         # Configuration and constants
├── utils/
│   ├── logger.ts              # Logging utility
│   └── database-cleaner.ts    # Database cleanup utility
└── seeders/
    ├── base-seeder.ts         # Base class for all seeders
    ├── permission-seeder.ts   # Permissions seeding
    ├── role-seeder.ts         # Roles and role-permission relationships
    ├── user-seeder.ts         # Users seeding
    ├── category-seeder.ts     # Categories and tags seeding
    ├── post-seeder.ts         # Posts seeding
    ├── company-seeder.ts      # Companies seeding
    ├── job-seeder.ts          # Jobs seeding
    ├── telegram-seeder.ts     # Telegram groups seeding
    ├── menu-seeder.ts         # Menu categories and items
    ├── page-seeder.ts         # Page categories and pages
    ├── source-seeder.ts       # Sources seeding
    └── endpoint-access-seeder.ts # Endpoint access configuration
```

## Usage

### Basic Seeding

```bash
# Run all seeders
npm run seed

# Development mode (with debug logging)
npm run seed:dev

# Clean database only
npm run seed:clean
```

### Advanced Usage

```typescript
import { PrismaClient } from "@prisma/client";
import { Logger } from "./utils/logger";
import { SeedOrchestrator } from "./orchestrator";

const prisma = new PrismaClient();
const logger = new Logger();
const orchestrator = new SeedOrchestrator(prisma, logger);

// Run specific seeders
await orchestrator.seedSpecific(prisma, ['PermissionSeeder', 'RoleSeeder']);

// Get available seeders
const availableSeeders = orchestrator.getAvailableSeeders();
```

## Configuration

The seeding system is configured through `config/seed-config.ts`:

```typescript
export const SEED_CONFIG = {
  defaultAdminPassword: "eksicode2025**",
  bcryptRounds: 10,
  batchSizes: {
    users: 50,
    posts: 100,
    companies: 20,
    jobs: 50,
  },
  // ... more configuration
};
```

## Creating New Seeders

To create a new seeder:

1. Extend the `BaseSeeder` class:

```typescript
import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";

export class MyNewSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info("Seeding my new data...");
    
    // Use helper methods for common operations
    await this.safeUpsert(
      () => tx.myModel.upsert({
        where: { id: 1 },
        update: { name: "Updated" },
        create: { name: "New" }
      }),
      'my model',
      'identifier'
    );
    
    this.logger.success("My new data seeded successfully");
  }
}
```

2. Add the seeder to the orchestrator in `orchestrator.ts`:

```typescript
this.seeders = [
  // ... existing seeders
  new MyNewSeeder(prisma, logger),
];
```

## Helper Methods

The `BaseSeeder` class provides several helper methods:

### `safeUpsert(operation, entityName, identifier?)`
Wraps upsert operations with error handling.

### `processBatch(items, processor, batchSize, tx)`
Processes items in batches for better performance.

### `checkDataExists(query, entityName)`
Checks if data already exists before processing.

### `logProgress(current, total, operation)`
Logs progress for long-running operations.

## Error Handling

The system includes comprehensive error handling:

- **SeedingError**: Custom error type with context
- **Transaction Rollback**: Automatic rollback on errors
- **Detailed Logging**: Error context and stack traces
- **Graceful Degradation**: Continue with warnings when possible

## Migration from Old System

To migrate from the old `seed.ts` file:

1. Run the migration script:
```bash
tsx prisma/migrate-seed.ts
```

2. Test the new system:
```bash
npm run seed
```

3. Compare results and remove old files when satisfied

## Performance Features

- **Batch Processing**: Configurable batch sizes for bulk operations
- **Transaction Support**: Single transaction for data consistency
- **Parallel Processing**: Safe parallel execution where possible
- **Memory Efficient**: Streaming for large datasets

## Monitoring and Debugging

### Logging Levels
- **Info**: General progress information
- **Success**: Successful operations
- **Warn**: Non-fatal issues that continue processing
- **Error**: Fatal errors with full context
- **Debug**: Detailed information (development mode only)

### Progress Tracking
The system provides detailed progress tracking:
- Operations completed vs total
- Time taken per operation
- Batch processing progress
- Memory usage monitoring

## Environment Configuration

Set environment variables for different behaviors:

```bash
# Enable debug logging
NODE_ENV=development npm run seed

# Database connection
DATABASE_URL="postgresql://..."
```

## Best Practices

1. **Order Dependencies**: Ensure seeders run in dependency order
2. **Idempotent Operations**: Use upsert for repeatable seeding
3. **Batch Processing**: Use appropriate batch sizes for performance
4. **Error Context**: Provide meaningful error messages
5. **Data Validation**: Validate data before insertion
6. **Transaction Usage**: Use transactions for data consistency

## Troubleshooting

### Common Issues

**Foreign Key Constraints**
- Ensure seeders run in dependency order
- Check that referenced entities exist

**Memory Issues**
- Reduce batch sizes in configuration
- Use streaming for very large datasets

**Transaction Timeouts**
- Split large operations into smaller transactions
- Increase database timeout settings

**Type Errors**
- Ensure data matches Prisma schema types
- Use proper type casting for enums

### Debug Mode

Enable debug mode for detailed logging:
```bash
NODE_ENV=development npm run seed
```

This will show:
- Detailed operation logs
- Batch processing progress
- Memory usage information
- Performance metrics

## Contributing

When adding new seeders:

1. Follow the existing patterns
2. Add appropriate error handling
3. Include progress logging
4. Write unit tests
5. Update documentation

## License

This seeding system is part of the EksiCode project and follows the same license terms.
