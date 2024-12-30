import { PrismaClient, Users, Prisma } from "@prisma/client";

class UserService {
  private prisma = new PrismaClient();

  /**
   * Get all users
   */
  public async getAllUsers(
    skip: number,
    limit: number,
    summaryOnly: boolean
  ): Promise<{ users: Users[]; count: number }> {
    const [users, count] = await Promise.all([
      this.prisma.users.findMany({
        skip,
        take: limit,
        select: summaryOnly
          ? {
              id: true,
              email: true,
              password: true,
              firstName: true,
              lastName: true,
              username: true,
              profilePicture: true,
              birthday: true,
              telegramId: true,
              phoneNumber: true,
              linkedin: true,
              website: true,
              github: true,
              twitter: true,
              instagram: true,
              facebook: true,
              verified: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true,
            }
          : undefined,
      }),
      this.prisma.users.count(),
    ]);
    return { users, count };
  }

  /**
   * Get user by ID
   */
  public async getUserById(id: number): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user
   */
  public async createUser(data: Prisma.UsersCreateInput): Promise<Users> {
    return this.prisma.users.create({
      data,
    });
  }

  /**
   * Update an existing user
   */
  public async updateUser(id: number, data: Partial<Users>): Promise<Users> {
    return this.prisma.users.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a user
   */
  public async deleteUser(id: number): Promise<Users> {
    return this.prisma.users.delete({
      where: { id },
    });
  }
}

export default UserService;
