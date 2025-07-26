import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG, SeedValidator } from "../config/seed-config";
import bcrypt from 'bcrypt';

interface AdminUserData {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  role: string;
  verified: boolean;
  emailVerified: boolean;
}

/**
 * Seeder for users
 */
export class UserSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info("Seeding admin users...");

    // Get all roles for mapping
    const roles = await tx.role.findMany({
      select: { id: true, name: true }
    });
    
    const roleMap = new Map(roles.map(r => [r.name, r.id]));

    // Hash the admin password once
    const hashedPassword = await bcrypt.hash(
      SEED_CONFIG.defaultAdminPassword, 
      SEED_CONFIG.bcryptRounds
    );

    // Process each admin user
    const createdUsers = await this.processBatch(
      [...SEED_CONFIG.defaultUsers] as AdminUserData[],
      async (userData: AdminUserData, tx) => {
        return await this.createAdminUser(tx, userData, hashedPassword, roleMap);
      },
      3, // Small batch size for admin users
      tx
    );

    this.logger.success(`Created/updated ${createdUsers.length} admin users`);

    // Log created users for verification
    for (const user of createdUsers) {
      if (user && typeof user === 'object' && 'email' in user && 'username' in user) {
        this.logger.info(`  - ${user.email} (${user.username}) with assigned role`);
      }
    }
  }

  private async createAdminUser(
    tx: Prisma.TransactionClient,
    userData: AdminUserData,
    hashedPassword: string,
    roleMap: Map<string, number>
  ) {
    // Validate user data
    SeedValidator.validateRequired(userData.email, 'User email');
    SeedValidator.validateRequired(userData.username, 'Username');
    
    if (!SeedValidator.validateEmail(userData.email)) {
      throw new Error(`Invalid email: ${userData.email}`);
    }
    
    if (!SeedValidator.validateUsername(userData.username)) {
      throw new Error(`Invalid username: ${userData.username}`);
    }

    // Get role ID
    const roleId = roleMap.get(userData.role);
    if (!roleId) {
      throw new Error(`Role "${userData.role}" not found`);
    }

    // Create/update user
    const user = await this.safeUpsert(
      () => tx.user.upsert({
        where: { email: userData.email },
        update: {
          username: userData.username,
          password: hashedPassword,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          verified: userData.verified,
          emailVerified: userData.emailVerified,
          profilePictureId: null,
          birthday: null,
          telegramId: null,
          phoneNumber: null,
          linkedin: null,
          github: null,
          website: null,
          twitter: null,
          instagram: null,
          facebook: null,
          userRoles: {
            deleteMany: {}, // Clear existing roles
            create: [{ roleId }]
          }
        },
        create: {
          email: userData.email,
          username: userData.username,
          password: hashedPassword,
          firstName: userData.firstName || null,
          lastName: userData.lastName || null,
          verified: userData.verified,
          emailVerified: userData.emailVerified,
          profilePictureId: null,
          birthday: null,
          telegramId: null,
          phoneNumber: null,
          linkedin: null,
          github: null,
          website: null,
          twitter: null,
          instagram: null,
          facebook: null,
          userRoles: {
            create: [{ roleId }]
          }
        },
        include: {
          userRoles: {
            include: {
              role: true
            }
          }
        }
      }),
      'admin user',
      userData.email
    );

    return user;
  }
}
