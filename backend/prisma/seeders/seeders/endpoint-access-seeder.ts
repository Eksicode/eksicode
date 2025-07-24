import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";

/**
 * Seeder for endpoint access configuration
 */
export class EndpointAccessSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info("Seeding endpoint access...");

    try {
      // Try to import the endpoint access data
      const { endpointAccessData } = await import('../datas/endpointAccessData');

      const endpoints = await this.processBatch(
        endpointAccessData,
        async (endpoint: any, tx) => {
          const { path, method, requiredRoles, requiredPermissions } = endpoint;

          // Find role and permission records
          const roles = await Promise.all(
            requiredRoles.map((roleName: string) =>
              tx.role.findUnique({ where: { name: roleName } })
            )
          );

          const permissions = await Promise.all(
            requiredPermissions.map((permName: string) =>
              tx.permission.findUnique({ where: { name: permName } })
            )
          );

          // Filter out null results
          const validRoles = roles.filter(role => role !== null);
          const validPermissions = permissions.filter(permission => permission !== null);

          if (validRoles.length !== requiredRoles.length) {
            const missing = requiredRoles.filter((name: string) => 
              !validRoles.some(role => role?.name === name)
            );
            this.logger.warn(`Some roles not found for endpoint ${path}:${method}: ${missing.join(', ')}`);
          }

          if (validPermissions.length !== requiredPermissions.length) {
            const missing = requiredPermissions.filter((name: string) => 
              !validPermissions.some(permission => permission?.name === name)
            );
            this.logger.warn(`Some permissions not found for endpoint ${path}:${method}: ${missing.join(', ')}`);
          }

          return await this.safeUpsert(
            () => tx.endpointAccess.upsert({
              where: { 
                path_method: { path, method }
              },
              update: {
                roles: {
                  set: [], // Clear existing roles
                  connect: validRoles.map(role => ({ id: role!.id }))
                },
                permissions: {
                  set: [], // Clear existing permissions
                  connect: validPermissions.map(permission => ({ id: permission!.id }))
                }
              },
              create: {
                path,
                method,
                roles: {
                  connect: validRoles.map(role => ({ id: role!.id }))
                },
                permissions: {
                  connect: validPermissions.map(permission => ({ id: permission!.id }))
                }
              }
            }),
            'endpoint access',
            `${path}:${method}`
          );
        },
        10,
        tx
      );

      this.logger.success(`Created/updated ${endpoints.length} endpoint access records`);

    } catch (error) {
      if ((error as any).code === 'MODULE_NOT_FOUND') {
        this.logger.warn("Endpoint access data file not found, skipping endpoint access seeding");
        return;
      }
      throw error;
    }
  }
}
