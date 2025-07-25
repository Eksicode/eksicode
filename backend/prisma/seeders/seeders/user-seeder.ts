import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG, SeedValidator } from "../config/seed-config";
import bcrypt from 'bcrypt';

/**
 * Seeder for users
 */
export class UserSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info("Seeding users...");

    // Get the admin role
    const adminRole = await tx.role.findUnique({
      where: { name: SEED_CONFIG.defaultAdmin.role }
    });

    if (!adminRole) {
      throw new Error(`Admin role "${SEED_CONFIG.defaultAdmin.role}" not found`);
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(
      SEED_CONFIG.defaultAdminPassword, 
      SEED_CONFIG.bcryptRounds
    );

    // Validate admin data
    SeedValidator.validateRequired(SEED_CONFIG.defaultAdmin.email, 'Admin email');
    SeedValidator.validateRequired(SEED_CONFIG.defaultAdmin.username, 'Admin username');
    
    if (!SeedValidator.validateEmail(SEED_CONFIG.defaultAdmin.email)) {
      throw new Error(`Invalid admin email: ${SEED_CONFIG.defaultAdmin.email}`);
    }
    
    if (!SeedValidator.validateUsername(SEED_CONFIG.defaultAdmin.username)) {
      throw new Error(`Invalid admin username: ${SEED_CONFIG.defaultAdmin.username}`);
    }

    // Create admin user with new fields
    const adminUser = await this.safeUpsert(
      () => tx.user.upsert({
        where: { email: SEED_CONFIG.defaultAdmin.email },
        update: {
          username: SEED_CONFIG.defaultAdmin.username,
          password: hashedPassword,
          firstName: null,
          lastName: null,
          profilePictureId: null, // Will be set if media is available
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
            create: [{ roleId: adminRole.id }]
          }
        },
        create: {
          email: SEED_CONFIG.defaultAdmin.email,
          username: SEED_CONFIG.defaultAdmin.username,
          password: hashedPassword,
          firstName: null,
          lastName: null,
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
          emailVerified: true,
          verified: true,
          userRoles: {
            create: [{ roleId: adminRole.id }]
          }
        }
      }),
      'admin user',
      SEED_CONFIG.defaultAdmin.email
    );

    this.logger.success(`Created/updated admin user: ${adminUser.email}`);
  }
}
