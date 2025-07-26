import { PrismaClient, Permission, Prisma } from "@prisma/client";
import { isEmpty } from "../utils/util";
import { HttpException } from "../exceptions/HttpException";
import { prisma } from "../config/database";

class PermissionService {
  private prisma: PrismaClient;

  constructor(prismaInstance?: PrismaClient) {
    this.prisma = prismaInstance || prisma;
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