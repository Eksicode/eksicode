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
              roles: true,
              permissions: true,
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
  async findUserById(id: number | string, requestingUserId?: number) {
    try {
      const userId = this.validateUserId(id);
      console.log(`Finding user by ID: ${userId}`);
  
      // Authorization check - only allow access if:
      // 1. User is accessing their own profile (requestingUserId === userId), or
      // 2. User has admin privileges
      if (requestingUserId) {
        if (requestingUserId !== userId) {
          await this.verifyAdminAccess(requestingUserId);
        }
      } else {
        // If no requestingUserId is provided, this means either:
        // - The request is unauthenticated (should be handled by auth middleware)
        // - Or there's a logic error in the calling code
        console.warn('No requestingUserId provided, skipping permission check. This may be a security issue.');
      }
  
      const user = await this.fetchUserWithDetails(userId);
      
      if (!user) {
        throw new HttpException(404, `User not found with ID: ${userId}`);
      }
  
      return user;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Error finding user', { originalError: error });
    }
  }
  
  /**
   * Validates and converts a user ID to a number
   */
  private validateUserId(id: number | string): number {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (!Number.isInteger(userId) || userId <= 0) {
      throw new HttpException(400, 'Invalid user ID', { providedId: id, parsedId: userId });
    }
    
    return userId;
  }
  
  /**
   * Checks if the requesting user has admin privileges and throws an exception if not
   */
  private async verifyAdminAccess(userId: number): Promise<void> {
    const isAdmin = await this.isUserAdmin(userId);
    console.log(`Is Admin: ${isAdmin}`);
    
    if (!isAdmin) {
      throw new HttpException(403, 'Access denied: You can only view your own profile');
    }
  }
  
  /**
   * Determines if a user has admin privileges
   */
  private async isUserAdmin(userId: number): Promise<boolean> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          roles: true,
          permissions: true
        }
      });
      
      if (!user) return false;
      
      // Check if user has admin or superadmin role
      const hasAdminRole = user.roles?.some(role => ['admin', 'superadmin'].includes(role));
      if (hasAdminRole) return true;
      
      // Check if user has admin permissions
      const adminPermissions = ['admin.access', 'admin.manage'];
      const hasAdminPermission = user.permissions?.some(permission => 
        adminPermissions.includes(permission)
      );
      
      return hasAdminPermission || false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
  
  /**
   * Fetches a user with all relevant details
   */
  private async fetchUserWithDetails(userId: number) {
    return this.prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
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
        roles: true,  // This will return string[] based on your schema
        createdAt: true,
        updatedAt: true
      }
    });
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

    // Create user with default role
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username: String(username),
        emailVerificationToken: hashedEmailToken,
        emailVerified: false,
        roles: ['user'], // Default role is already set in the schema
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


  public async assignRoleToUser(userId: number, roleName: string): Promise<void> {
    // Validate role name
    if (!['user', 'admin', 'superadmin', 'moderator'].includes(roleName)) {
      throw new HttpException(400, 'Invalid role name');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { roles: true }
    });
    
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    
    // Check if user already has this role
    if (user.roles.includes(roleName)) {
      return; // Role already assigned
    }
    
    // Add the new role to the array
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        roles: {
          push: roleName
        }
      }
    });
  }

  public async getUserRoles(userId: number): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { roles: true }
    });
    
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    
    return user.roles;
  }

  /**
   * Remove a role from a user
   */
  public async removeRoleFromUser(userId: number, roleName: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { roles: true }
      });
      
      if (!user) {
        throw new HttpException(404, 'User not found');
      }
      
      // Filter out the role to remove
      const updatedRoles = user.roles.filter(role => role !== roleName);
      
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          roles: updatedRoles
        }
      });
    } catch (error) {
      throw new HttpException(500, 'Failed to remove role from user', { originalError: error });
    }
  }

  /**
   * Check if a user has a specific permission
   */
  public async hasPermission(userId: number, permissionName: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { permissions: true, roles: true }
    });
    
    if (!user) return false;

    // Check direct permissions
    if (user.permissions.includes(permissionName)) return true;

    // Superadmin has all permissions
    if (user.roles.includes('superadmin')) return true;

    // Admin has most permissions except superadmin-specific ones
    if (user.roles.includes('admin') && !permissionName.startsWith('superadmin.')) return true;

    return false;
  }

  /**
   * Get all permissions for a user
   */
  public async getUserPermissions(userId: number): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { permissions: true }
    });
    
    return user?.permissions || [];
  }
  
  /**
   * Assign a permission to a user
   */
  public async assignPermissionToUser(userId: number, permissionName: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { permissions: true }
    });
    
    if (!user) {
      throw new HttpException(404, 'User not found');
    }
    
    // Check if user already has this permission
    if (user.permissions.includes(permissionName)) {
      return; // Permission already assigned
    }
    
    // Add the new permission to the array
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        permissions: {
          push: permissionName
        }
      }
    });
  }
  
  /**
   * Remove a permission from a user
   */
  public async removePermissionFromUser(userId: number, permissionName: string): Promise<void> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { permissions: true }
      });
      
      if (!user) {
        throw new HttpException(404, 'User not found');
      }
      
      // Filter out the permission to remove
      const updatedPermissions = user.permissions.filter(permission => permission !== permissionName);
      
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          permissions: updatedPermissions
        }
      });
    } catch (error) {
      throw new HttpException(500, 'Failed to remove permission from user', { originalError: error });
    }
  }
}

export default UserService;
