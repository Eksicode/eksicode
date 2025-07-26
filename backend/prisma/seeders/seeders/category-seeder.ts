import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";

type CategoryData = {
  id: number;
  name: string;
  slug?: string;
};

type TagData = {
  id: number;
  name: string;
  slug?: string;
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

  /**
   * Generate a URL-friendly slug from a name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private async seedCategories(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${SEED_CONFIG.defaultCategories.length} post categories...`);

    const categories = await this.processBatch(
      [...SEED_CONFIG.defaultCategories] as CategoryData[],
      async (category: CategoryData, tx) => {
        const categoryData = {
          ...category,
          slug: category.slug || this.generateSlug(category.name)
        };
        
        return await this.safeUpsert(
          () => tx.postCategory.upsert({
            where: { name: category.name },
            update: { 
              name: category.name,
              slug: categoryData.slug
            },
            create: categoryData
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
        const tagData = {
          ...tag,
          slug: tag.slug || this.generateSlug(tag.name)
        };
        
        return await this.safeUpsert(
          () => tx.tag.upsert({
            where: { name: tag.name },
            update: { 
              name: tag.name,
              slug: tagData.slug
            },
            create: tagData
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
