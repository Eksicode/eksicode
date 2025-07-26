import { PrismaClient, Role, Permission } from '@prisma/client';
import { HttpException } from '../exceptions/HttpException';

export interface CreateRoleData {
  name: string;
  description?: string;
  parentId?: number;
  level?: number;
}

export interface CreatePermissionData {
  name: string;
  description?: string;
  category?: string;
  resource?: string;
  action?: string;
}

class RolePermissionService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // Role Management
  public async createRole(data: CreateRoleData): Promise<Role> {
    try {
      // Check if role already exists
      const existingRole = await this.prisma.role.findUnique({
        where: { name: data.name },
      });

      if (existingRole) {
        throw new HttpException(400, `Role '${data.name}' already exists`);
      }

      // If parent specified, validate it exists
      if (data.parentId) {
        const parentRole = await this.prisma.role.findUnique({
          where: { id: data.parentId, active: true },
        });

        if (!parentRole) {
          throw new HttpException(400, 'Parent role not found');
        }
      }

      return await this.prisma.role.create({
        data: {
          name: data.name,
          description: data.description,
          parentId: data.parentId,
          level: data.level || 100,
          active: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to create role', { originalError: error });
    }
  }

  public async getAllRoles(): Promise<Role[]> {
    return this.prisma.role.findMany({
      where: { active: true },
      include: {
        parent: true,
        children: true,
        permissions: true,
      },
      orderBy: [
        { level: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  public async getRoleById(id: number): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id, active: true },
      include: {
        parent: true,
        children: true,
        permissions: true,
        users: {
          where: { active: true },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  public async updateRole(id: number, data: Partial<CreateRoleData>): Promise<Role> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id, active: true },
      });

      if (!role) {
        throw new HttpException(404, 'Role not found');
      }

      // If updating name, check uniqueness
      if (data.name && data.name !== role.name) {
        const existingRole = await this.prisma.role.findUnique({
          where: { name: data.name },
        });

        if (existingRole) {
          throw new HttpException(400, `Role '${data.name}' already exists`);
        }
      }

      return await this.prisma.role.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to update role', { originalError: error });
    }
  }

  public async deleteRole(id: number): Promise<void> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id, active: true },
        include: {
          users: { where: { active: true } },
          children: { where: { active: true } },
        },
      });

      if (!role) {
        throw new HttpException(404, 'Role not found');
      }

      // Check if role has active users
      if (role.users.length > 0) {
        throw new HttpException(400, 'Cannot delete role with active users');
      }

      // Check if role has child roles
      if (role.children.length > 0) {
        throw new HttpException(400, 'Cannot delete role with child roles');
      }

      // Soft delete
      await this.prisma.role.update({
        where: { id },
        data: { active: false },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to delete role', { originalError: error });
    }
  }

  // Permission Management
  public async createPermission(data: CreatePermissionData): Promise<Permission> {
    try {
      // Check if permission already exists
      const existingPermission = await this.prisma.permission.findUnique({
        where: { name: data.name },
      });

      if (existingPermission) {
        throw new HttpException(400, `Permission '${data.name}' already exists`);
      }

      return await this.prisma.permission.create({
        data: {
          name: data.name,
          description: data.description,
          category: data.category || 'general',
          resource: data.resource,
          action: data.action || 'read',
          active: true,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to create permission', { originalError: error });
    }
  }

  public async getAllPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany({
      where: { active: true },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });
  }

  public async getPermissionById(id: number): Promise<Permission | null> {
    return this.prisma.permission.findUnique({
      where: { id, active: true },
      include: {
        roles: {
          where: { active: true },
        },
        userPermissions: {
          where: { active: true },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });
  }

  public async updatePermission(id: number, data: Partial<CreatePermissionData>): Promise<Permission> {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: { id, active: true },
      });

      if (!permission) {
        throw new HttpException(404, 'Permission not found');
      }

      // If updating name, check uniqueness
      if (data.name && data.name !== permission.name) {
        const existingPermission = await this.prisma.permission.findUnique({
          where: { name: data.name },
        });

        if (existingPermission) {
          throw new HttpException(400, `Permission '${data.name}' already exists`);
        }
      }

      return await this.prisma.permission.update({
        where: { id },
        data,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to update permission', { originalError: error });
    }
  }

  public async deletePermission(id: number): Promise<void> {
    try {
      const permission = await this.prisma.permission.findUnique({
        where: { id, active: true },
        include: {
          userPermissions: { where: { active: true } },
          roles: true,
        },
      });

      if (!permission) {
        throw new HttpException(404, 'Permission not found');
      }

      // Check if permission is in use
      if (permission.userPermissions.length > 0 || permission.roles.length > 0) {
        throw new HttpException(400, 'Cannot delete permission that is in use');
      }

      // Soft delete
      await this.prisma.permission.update({
        where: { id },
        data: { active: false },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to delete permission', { originalError: error });
    }
  }

  // Role-Permission Association
  public async assignPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId, active: true },
        include: { permissions: true },
      });

      if (!role) {
        throw new HttpException(404, 'Role not found');
      }

      const permission = await this.prisma.permission.findUnique({
        where: { id: permissionId, active: true },
      });

      if (!permission) {
        throw new HttpException(404, 'Permission not found');
      }

      // Check if permission is already assigned
      const alreadyAssigned = role.permissions.some(p => p.id === permissionId);
      if (alreadyAssigned) {
        return; // Already assigned
      }

      await this.prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            connect: { id: permissionId },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to assign permission to role', { originalError: error });
    }
  }

  public async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    try {
      const role = await this.prisma.role.findUnique({
        where: { id: roleId, active: true },
        include: { permissions: true },
      });

      if (!role) {
        throw new HttpException(404, 'Role not found');
      }

      // Check if permission is assigned
      const isAssigned = role.permissions.some(p => p.id === permissionId);
      if (!isAssigned) {
        return; // Not assigned
      }

      await this.prisma.role.update({
        where: { id: roleId },
        data: {
          permissions: {
            disconnect: { id: permissionId },
          },
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to remove permission from role', { originalError: error });
    }
  }

  // Utility methods
  public async getPermissionsByCategory(): Promise<Record<string, Permission[]>> {
    const permissions = await this.getAllPermissions();
    
    return permissions.reduce((acc, permission) => {
      const category = permission.category || 'general';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  }

  public async getRoleHierarchy(): Promise<Role[]> {
    return this.prisma.role.findMany({
      where: { active: true, parentId: null },
      include: {
        children: {
          where: { active: true },
          include: {
            children: {
              where: { active: true },
            },
          },
        },
        permissions: true,
      },
      orderBy: { level: 'asc' },
    });
  }
}

export default RolePermissionService;
