import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { pageCategories, pages } from "../datas/pagesData";

/**
 * Seeder for page categories and pages
 */
export class PageSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info("Seeding page categories and pages...");
    
    // First seed page categories
    await this.seedPageCategories(tx);
    
    // Then seed pages
    await this.seedPages(tx);
  }

  private async seedPageCategories(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${pageCategories.length} page categories...`);
    
    const categories = await this.processBatch(
      pageCategories,
      async (category: any, tx) => {
        return await this.safeUpsert(
          () => tx.pageCategory.upsert({
            where: { name: category.name },
            update: category,
            create: category,
          }),
          'page category',
          category.name
        );
      },
      10,
      tx
    );

    this.logger.success(`Created/updated ${categories.length} page categories`);
  }

  private async seedPages(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${pages.length} pages...`);

    const pageItems = await this.processBatch(
      pages,
      async (page: any, tx) => {
        const { categories, ...pageData } = page;
        
        return await this.safeUpsert(
          () => tx.page.upsert({
            where: { slug: pageData.slug },
            update: {
              ...pageData,
              categories: { 
                set: [], // Clear existing categories
                connect: categories.map((name: string) => ({ name })) 
              }
            },
            create: { 
              ...pageData, 
              categories: { 
                connect: categories.map((name: string) => ({ name })) 
              } 
            },
          }),
          'page',
          pageData.slug
        );
      },
      15,
      tx
    );

    this.logger.success(`Created/updated ${pageItems.length} pages`);
  }
}
