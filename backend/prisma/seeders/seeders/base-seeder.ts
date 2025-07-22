import { PrismaClient, Prisma } from "@prisma/client";
import { Logger } from "../utils/logger";
import { SeedingError } from "../config/seed-config";

/**
 * Base class for all seeders
 * Provides common functionality and enforces consistent interface
 */
export abstract class BaseSeeder {
  constructor(
    protected readonly prisma: PrismaClient,
    protected readonly logger: Logger
  ) {}

  /**
   * Main seeding method - must be implemented by each seeder
   */
  abstract seed(tx: Prisma.TransactionClient): Promise<void>;

  /**
   * Get the name of this seeder for logging
   */
  get name(): string {
    return this.constructor.name;
  }

  /**
   * Helper method to handle upsert operations with proper error handling
   */
  protected async safeUpsert<T>(
    operation: () => Promise<T>,
    entityName: string,
    identifier?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      const errorMessage = identifier 
        ? `Failed to upsert ${entityName} with identifier "${identifier}"`
        : `Failed to upsert ${entityName}`;
      
      throw new SeedingError(
        errorMessage,
        this.name,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Helper method for batch operations
   */
  protected async processBatch<T, R>(
    items: T[],
    processor: (item: T, tx: Prisma.TransactionClient) => Promise<R>,
    batchSize: number = 50,
    tx: Prisma.TransactionClient
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      this.logger.debug(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)} (${batch.length} items)`);
      
      const batchResults = await Promise.all(
        batch.map(item => processor(item, tx))
      );
      
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * Helper method to check if data exists
   */
  protected async checkDataExists<T>(
    query: () => Promise<T | null>,
    entityName: string
  ): Promise<boolean> {
    try {
      const result = await query();
      return result !== null;
    } catch (error) {
      this.logger.warn(`Error checking if ${entityName} exists:`, error);
      return false;
    }
  }

  /**
   * Helper method for logging progress
   */
  protected logProgress(current: number, total: number, operation: string): void {
    const percentage = Math.round((current / total) * 100);
    this.logger.info(`${operation}: ${current}/${total} (${percentage}%)`);
  }
}
