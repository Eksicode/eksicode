import { PrismaClient, Role } from '@prisma/client';

class RoleService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  public async createRole(name: string, description: string): Promise<Role> {
    return this.prisma.role.create({
      data: {
        name,
        description,
      },
    });
  }

  public async getAllRoles(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }

  public async getRoleById(id: number): Promise<Role | null> {
    return this.prisma.role.findUnique({ where: { id } });
  }

  public async updateRole(id: number, data: Partial<Role>): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  public async deleteRole(id: number): Promise<Role> {
    return this.prisma.role.delete({ where: { id } });
  }
}

export default RoleService; 