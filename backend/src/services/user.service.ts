import { PrismaClient, User, Prisma } from "@prisma/client";

class UserService {
  private prisma = new PrismaClient();

  /**
   * Get all users
   */
  public async getAllUsers(
    skip: number,
    limit: number,
    summaryOnly: boolean
  ): Promise<{ users: User[]; count: number }> {
    const [users, count] = await Promise.all([
      this.prisma.user.findMany({
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
      this.prisma.user.count(),
    ]);
    return { users, count };
  }

  /**
   * Get user by ID
   */
  public async getUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new user
   */
  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  /**
   * Update an existing user
   */
  public async updateUser(id: number, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a user
   */
  public async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}

export default UserService;
