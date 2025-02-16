import { PrismaClient, Permission } from '@prisma/client';

class PermissionService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createPermission(name: string, description: string): Promise<Permission> {
    return this.prisma.permission.create({
      data: {
        name,
        description,
      },
    });
  }

  public async getAllPermissions(): Promise<Permission[]> {
    return this.prisma.permission.findMany();
  }

  public async getPermissionById(id: number): Promise<Permission | null> {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  public async updatePermission(id: number, data: Partial<Permission>): Promise<Permission> {
    return this.prisma.permission.update({
      where: { id },
      data,
    });
  }

  public async deletePermission(id: number): Promise<Permission> {
    return this.prisma.permission.delete({ where: { id } });
  }
}

export default PermissionService; 