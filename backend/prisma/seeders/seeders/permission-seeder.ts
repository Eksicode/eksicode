import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";

type PermissionData = {
  name: string;
  description: string;
  category?: string;
  resource?: string;
  action?: string;
};

/**
 * Seeder for permissions
 */
export class PermissionSeeder extends BaseSeeder {
  /**
   * Parse permission name to extract resource and action
   */
  private parsePermission(name: string): { resource?: string; action: string; category: string } {
    const parts = name.split('_');
    
    if (parts.length >= 2) {
      const action = parts[0].toLowerCase();
      const resource = parts.slice(1).join('_').toLowerCase();
      
      // Determine category based on resource
      let category = 'general';
      if (['post', 'comment'].includes(resource.split('_')[0])) {
        category = 'content';
      } else if (['user', 'role', 'permission'].includes(resource.split('_')[0])) {
        category = 'user_management';
      } else if (['system', 'admin'].includes(resource.split('_')[0])) {
        category = 'system';
      } else if (['company', 'job'].includes(resource.split('_')[0])) {
        category = 'business';
      } else if (['media'].includes(resource.split('_')[0])) {
        category = 'media';
      }
      
      return { action, resource, category };
    }
    
    return { action: 'read', category: 'general' };
  }

  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${SEED_CONFIG.permissions.length} permissions...`);

    const permissions = await this.processBatch(
      [...SEED_CONFIG.permissions] as PermissionData[],
      async (permission: PermissionData, tx) => {
        const { resource, action, category } = this.parsePermission(permission.name);
        
        const permissionData = {
          name: permission.name,
          description: permission.description,
          category: permission.category || category,
          resource: permission.resource || resource,
          action: permission.action || action,
        };
        
        return await this.safeUpsert(
          () => tx.permission.upsert({
            where: { name: permission.name },
            update: {
              description: permission.description,
              category: permissionData.category,
              resource: permissionData.resource,
              action: permissionData.action,
            },
            create: permissionData
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
