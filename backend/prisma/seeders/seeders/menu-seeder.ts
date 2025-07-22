import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";
import { menuItems } from "../../menuItemsData";

/**
 * Seeder for menu categories and menu items
 */
export class MenuSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info("Seeding menu categories and items...");
    
    // First seed menu categories
    await this.seedMenuCategories(tx);
    
    // Then seed menu items
    await this.seedMenuItems(tx);
  }

  private async seedMenuCategories(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${SEED_CONFIG.menuCategories.length} menu categories...`);
    
    const categoryMap = new Map<string, number>();
    
    const categories = await this.processBatch(
      [...SEED_CONFIG.menuCategories],
      async (name: string, tx) => {
        const category = await this.safeUpsert(
          () => tx.menuCategory.upsert({
            where: { name },
            create: { name },
            update: {}
          }),
          'menu category',
          name
        );
        categoryMap.set(name, category.id);
        return category;
      },
      10,
      tx
    );

    this.logger.success(`Created/updated ${categories.length} menu categories`);
    
    // Store category map for menu items
    (this as any).categoryMap = categoryMap;
  }

  private async seedMenuItems(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${menuItems.length} menu items...`);
    
    const categoryMap = (this as any).categoryMap as Map<string, number>;

    const items = await this.processBatch(
      menuItems,
      async (menuItem: any, tx) => {
        const { categories: categoryNames, id, ...menuItemData } = menuItem;
        
        // Get category IDs from the map
        const categoryIds = categoryNames
          .map((name: string) => categoryMap.get(String(name)))
          .filter((id: number | undefined) => id !== undefined);
        
        return await this.safeUpsert(
          () => tx.menu.upsert({
            where: { id: id || -1 },
            update: {
              ...menuItemData,
              categories: {
                set: [], // Clear existing categories
                connect: categoryIds.map(categoryId => ({ id: categoryId }))
              }
            },
            create: {
              ...menuItemData,
              categories: {
                connect: categoryIds.map(categoryId => ({ id: categoryId }))
              }
            }
          }),
          'menu item',
          menuItemData.title || `ID:${id}`
        );
      },
      20,
      tx
    );

    this.logger.success(`Created/updated ${items.length} menu items`);
  }
}
