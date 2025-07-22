import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";

type CategoryData = {
  id: number;
  name: string;
};

type TagData = {
  id: number;
  name: string;
};

/**
 * Seeder for post categories and tags
 */
export class CategorySeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info("Seeding categories and tags...");

    // Seed post categories
    await this.seedCategories(tx);
    
    // Seed tags
    await this.seedTags(tx);
  }

  private async seedCategories(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${SEED_CONFIG.defaultCategories.length} post categories...`);

    const categories = await this.processBatch(
      [...SEED_CONFIG.defaultCategories] as CategoryData[],
      async (category: CategoryData, tx) => {
        return await this.safeUpsert(
          () => tx.postCategory.upsert({
            where: { id: category.id },
            update: { name: category.name },
            create: category
          }),
          'post category',
          category.name
        );
      },
      10,
      tx
    );

    this.logger.success(`Created/updated ${categories.length} post categories`);
  }

  private async seedTags(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${SEED_CONFIG.defaultTags.length} tags...`);

    const tags = await this.processBatch(
      [...SEED_CONFIG.defaultTags] as TagData[],
      async (tag: TagData, tx) => {
        return await this.safeUpsert(
          () => tx.tag.upsert({
            where: { id: tag.id },
            update: { name: tag.name },
            create: tag
          }),
          'tag',
          tag.name
        );
      },
      20,
      tx
    );

    this.logger.success(`Created/updated ${tags.length} tags`);
  }
}
