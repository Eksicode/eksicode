import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";

type RoleData = {
  name: string;
  description: string;
  level: number;
  permissions: readonly string[];
};

/**
 * Seeder for roles and role-permission relationships
 */
export class RoleSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${SEED_CONFIG.roles.length} roles...`);

    // First, get all permissions for mapping
    const allPermissions = await tx.permission.findMany({
      select: { id: true, name: true }
    });
    
    const permissionMap = new Map(
      allPermissions.map(p => [p.name, p.id])
    );

    const roles = await this.processBatch(
      SEED_CONFIG.roles.map(role => ({
        name: role.name,
        description: role.description,
        level: role.level,
        permissions: [...role.permissions]
      })),
      async (roleData: RoleData, tx) => {
        const { permissions: permissionNames, level, ...roleInfo } = roleData;
        
        // Find permission IDs
        const permissionIds = permissionNames
          .map(name => permissionMap.get(name))
          .filter(id => id !== undefined) as number[];

        if (permissionIds.length !== permissionNames.length) {
          const missing = permissionNames.filter(name => !permissionMap.has(name));
          this.logger.warn(`Some permissions not found for role ${roleData.name}: ${missing.join(', ')}`);
        }

        return await this.safeUpsert(
          () => tx.role.upsert({
            where: { name: roleData.name },
            update: {
              description: roleInfo.description,
              level: level,
              permissions: {
                set: [], // Clear existing permissions
                connect: permissionIds.map(id => ({ id }))
              }
            },
            create: {
              ...roleInfo,
              level: level,
              permissions: {
                connect: permissionIds.map(id => ({ id }))
              }
            }
          }),
          'role',
          roleData.name
        );
      },
      5, // Small batch size for roles
      tx
    );

    this.logger.success(`Created/updated ${roles.length} roles`);
  }
}
