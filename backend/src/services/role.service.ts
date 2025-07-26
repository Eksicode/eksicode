import { PrismaClient, Role, Permission, Prisma } from '@prisma/client';
import { isEmpty } from "../utils/util";
import { HttpException } from '../exceptions/HttpException';
import { prisma } from "../config/database";

class RoleService {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || prisma;
  }

  public async createRole(name: string, description: string, permissionIds?: number[]): Promise<Role> {
    try {
      const existingRole = await this.prisma.role.findUnique({ where: { name } });
      if (existingRole) {
        throw new HttpException(400, `Role with name ${name} already exists`);
      }

      return await this.prisma.$transaction(async (prisma) => {
        const role = await prisma.role.create({
          data: {
            name,
            description,
          },
        });

        if (permissionIds?.length) {
          await prisma.role.update({
            where: { id: role.id },
            data: {
              permissions: {
                connect: permissionIds.map(id => ({ id }))
              }
            }
          });
        }

        return role;
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, 'Failed to create role', { originalError: error });
    }
  }

  public async getAllRoles(includePermissions: boolean = false): Promise<Role[]> {
    try {
      return await this.prisma.role.findMany({
        include: includePermissions ? {
          permissions: true
        } : undefined
      });
    } catch (error) {
      throw new HttpException(500, 'Failed to get all roles', { originalError: error });
    }
  }

  public async getRoleById(id: number, includePermissions: boolean = false): Promise<Role | null> {
    try {
      return await this.prisma.role.findUnique({
        where: { id },
        include: includePermissions ? {
          permissions: true
        } : undefined
      });
    } catch (error) {
      throw new HttpException(500, `Failed to get role with ID ${id}`, { originalError: error });
    }
  }

  public async updateRole(
    id: number,
    data: Partial<Role> & { permissionIds?: number[] }
  ): Promise<Role> {
    try {
      // Check if role exists
      const existingRole = await this.prisma.role.findUnique({ where: { id } });
      if (!existingRole) {
        throw new HttpException(404, `Role with ID ${id} not found`);
      }

      const { permissionIds, ...roleData } = data;

      return await this.prisma.$transaction(async (prisma) => {
        if (permissionIds !== undefined) {
          // Update role permissions
          await prisma.role.update({
            where: { id },
            data: {
              permissions: {
                set: []
              }
            }
          });

          // Add new permissions
          if (permissionIds.length > 0) {
            await prisma.role.update({
              where: { id },
              data: {
                permissions: {
                  connect: permissionIds.map(id => ({ id }))
                }
              }
            });
          }
        }

        return prisma.role.update({
          where: { id },
          data: roleData,
          include: {
            permissions: true
          }
        });
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException(404, `Role with ID ${id} not found`);
        }
      }
      throw new HttpException(500, 'Failed to update role', { originalError: error });
    }
  }

  public async deleteRole(id: number): Promise<Role> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id },
        include: { users: true }
      });

      if (!role) {
        throw new HttpException(404, `Role with ID ${id} not found`);
      }

      if (role.users.length > 0) {
        throw new HttpException(400, 'Cannot delete role with assigned users');
      }

      return this.prisma.role.delete({ where: { id } });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, 'Failed to delete role', { originalError: error });
    }
  }
  public async getRolePermissions(roleId: number): Promise<Permission[]> {
    try {
      const roleWithPermissions = await this.prisma.role.findUnique({
        where: { id: roleId },
        include: {
          permissions: true
        }
      });

      if (!roleWithPermissions) {
        throw new HttpException(404, `Role with ID ${roleId} not found`);
      }

      return roleWithPermissions.permissions;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, `Failed to get permissions for role with ID ${roleId}`, { originalError: error });
    }
  }

  public async assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<void> {
    try {
      // Check if role exists
      const existingRole = await this.prisma.role.findUnique({ where: { id: roleId } });
      if (!existingRole) {
        throw new HttpException(404, `Role with ID ${roleId} not found`);
      }

      await this.prisma.$transaction(async (prisma) => {
        // Update role permissions
        await prisma.role.update({
          where: { id: roleId },
          data: {
            permissions: {
              set: []
            }
          }
        });

        // Add new permissions
        if (permissionIds.length > 0) {
          await prisma.role.update({
            where: { id: roleId },
            data: {
              permissions: {
                connect: permissionIds.map(id => ({ id }))
              }
            }
          });
        }
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(500, 'Failed to assign permissions to role', { originalError: error });
    }
  }

  public async hasPermission(roleId: number, permissionName: string): Promise<boolean> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId },
        include: {
          permissions: true
        }
      });

      if (!role) return false;

      return role.permissions.some(permission => permission.name === permissionName);
    } catch (error) {
      throw new HttpException(500, `Failed to check permission for role with ID ${roleId}`, { originalError: error });
    }
  }
}

export default RoleService;
