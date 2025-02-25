import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { HttpException } from '../exceptions/HttpException';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import config from '../config';
class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

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
              emailVerificationToken: true,
              resetPasswordToken: true,
              resetPasswordExpires: true,
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
async findUserById(id: number | string): Promise<Omit<User, 'password'> | null> {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (!userId || isNaN(userId)) {
      console.log('Invalid user ID:', id);
      return null;
    }

    console.log('Looking up user with ID:', userId);

    return this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
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
        emailVerificationToken: true,
        resetPasswordToken: true,
        resetPasswordExpires: true,
        roles: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  public async getUserData(userId: number): Promise<Omit<User, 'password'> | null> {
    console.log('=== getUserData Service Method ===');
    console.log(`Received User ID: ${userId}`);
    console.log(`Type of userId: ${typeof userId}`);
    
    if (!userId) {
        console.log('Warning: No userId provided to getUserData');
        return null;
    }

    const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
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
            emailVerificationToken: true,
            resetPasswordToken: true,
            resetPasswordExpires: true,
            roles: true,
            createdAt: true,
            updatedAt: true
        }
    });

    console.log('User found:', user ? 'Yes' : 'No');
    return user;
}

  /**
   * Create a new user
   */
  public async createUser(email: string, password: string, username: string): Promise<User> {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username },
        ],
      },
    });

    if (existingUser?.email === email) {
      throw new HttpException(400, 'Email already in use');
    }
    if (existingUser?.username === username) {
      throw new HttpException(400, 'Username already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(32).toString('hex');
    const hashedEmailToken = await bcrypt.hash(emailToken, 10);

    const userRole = await this.prisma.role.findUnique({ where: { name: 'user' } });

    if (!userRole) {
      throw new HttpException(500, 'Default user role not found');
    }

    // Create user first
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: String(username),
        emailVerificationToken: hashedEmailToken,
        emailVerified: false,
      },
    });

    // Then assign role
    await this.prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: userRole.id,
      },
    });

    // Only attempt to send email if SMTP configuration is available
    if (config.email?.user && config.email?.password && config.email?.service) {
      try {
        const transporter = nodemailer.createTransport({
          service: config.email.service,
          auth: {
            user: config.email.user,
            pass: config.email.password,
          },
        });

        const mailOptions = {
          to: email,
          from: config.email.user,
          subject: 'Email Confirmation',
          text: `You are receiving this because you (or someone else) have created an account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${config.frontendHost}/confirm-email/${emailToken}\n\n
            If you did not request this, please ignore this email.\n`,
        };

        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error('Failed to send verification email:', error);
        // Don't throw error, allow user creation to succeed even if email fails
      }
    } else {
      console.warn('Email configuration not found. Skipping verification email.');
    }

    return user;
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

  public async findUserByEmailUsername(userInfo: string): Promise<User | null> {
    if (!userInfo) {
      throw new HttpException(400, 'Email or username must be provided');
    }
    console.log(`Finding user by email: ${userInfo}`); // Add logging
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: userInfo },
          { username: userInfo },
        ]
      },
    });
    console.log(`User found: ${user ? 'Yes' : 'No'}`); // Add logging
    return user;
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new HttpException(400, 'Email must be provided');
    }
    console.log(`Finding user by email: ${email}`); // Add logging
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.log(`User found: ${user ? 'Yes' : 'No'}`); // Add logging
    return user;
  }


  public async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    await this.prisma.userRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }

  public async getUserRoles(userId: number): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.map(userRole => userRole.role);
  }

  // Additional methods for roles and permissions can be added here
}

export default UserService;
