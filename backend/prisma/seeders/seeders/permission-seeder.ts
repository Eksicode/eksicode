import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";

type PermissionData = {
  name: string;
  description: string;
};

/**
 * Seeder for permissions
 */
export class PermissionSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${SEED_CONFIG.permissions.length} permissions...`);

    const permissions = await this.processBatch(
      [...SEED_CONFIG.permissions] as PermissionData[],
      async (permission: PermissionData, tx) => {
        return await this.safeUpsert(
          () => tx.permission.upsert({
            where: { name: permission.name },
            update: { description: permission.description },
            create: permission
          }),
          'permission',
          permission.name
        );
      },
      10, // Small batch size for permissions
      tx
    );

    this.logger.success(`Created/updated ${permissions.length} permissions`);
  }
}
