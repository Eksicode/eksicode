import { PrismaClient, User, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { HttpException } from '../exceptions/HttpException';
import crypto from 'crypto';
import EmailService from './email.service';
import MediaService, { MediaUpload } from './media.service';
import config from '../config';

class UserService {
  private prisma: PrismaClient;
  private emailService: EmailService;
  private mediaService: MediaService;

  // Safe user selection - excludes sensitive data like passwords, emails, tokens, etc.
  private readonly safeUserSelect = {
    id: true,
    firstName: true,
    lastName: true,
    username: true,
    profilePicture: {
      select: {
        id: true,
        url: true,
        altText: true,
        type: true,
      }
    },
    birthday: true,
    linkedin: true,
    website: true,
    github: true,
    twitter: true,
    instagram: true,
    facebook: true,
    verified: true,
    emailVerified: true,
    roles: true,
    permissions: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(prisma: PrismaClient, emailService: EmailService, mediaService?: MediaService) {
    this.prisma = prisma;
    this.emailService = emailService;
    this.mediaService = mediaService || new MediaService(prisma);
  }

  /**
   * Get all users
   */
  public async getAllUsers(
    skip: number,
    limit: number,
    summaryOnly: boolean
  ): Promise<{ users: Partial<User>[]; count: number }> {
    const [users, count] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: summaryOnly
          ? {
              id: true,
              username: true,
              profilePicture: {
                select: {
                  id: true,
                  url: true,
                  altText: true,
                }
              },
              verified: true,
              createdAt: true,
            }
          : this.safeUserSelect,
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
        profilePicture: {
          select: {
            id: true,
            url: true,
            altText: true,
            type: true,
          }
        },
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
    
    await this.emailService.sendVerificationEmail(email, emailToken);

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
    console.log(`Finding user by email or username: ${userInfo}`);
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: userInfo },
          { username: userInfo },
        ]
      },
    });

    if (user && !user.emailVerified) {
      throw new HttpException(401, 'Please verify your email before logging in.');
    }

    console.log(`User found: ${user ? 'Yes' : 'No'}`);
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

  /**
   * Verify user email with token
   */
  public async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find all users with email verification tokens
      const users = await this.prisma.user.findMany({
        where: {
          emailVerificationToken: { not: null },
          emailVerified: false
        }
      });

      // Check token against all users (since tokens are hashed)
      for (const user of users) {
        if (user.emailVerificationToken) {
          const isTokenValid = await bcrypt.compare(token, user.emailVerificationToken);
          
          if (isTokenValid) {
            // Update user as verified and remove token
            await this.prisma.user.update({
              where: { id: user.id },
              data: {
                emailVerified: true,
                emailVerificationToken: null
              }
            });

            return {
              success: true,
              message: 'Email verified successfully'
            };
          }
        }
      }

      throw new HttpException(400, 'Invalid or expired verification token');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Error verifying email', { originalError: error });
    }
  }

  /**
   * Resend email verification
   */
  public async resendEmailVerification(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      if (user.emailVerified) {
        throw new HttpException(400, 'Email is already verified');
      }

      // Generate new verification token
      const emailToken = crypto.randomBytes(32).toString('hex');
      const hashedEmailToken = await bcrypt.hash(emailToken, 10);

      // Update user with new token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: hashedEmailToken
        }
      });

      // Send verification email
      await this.emailService.sendVerificationEmail(email, emailToken);

      return {
        success: true,
        message: 'Verification email sent'
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Error resending verification email', { originalError: error });
    }
  }

  /**
   * Initiate password reset process
   */
  public async initiatePasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        // Don't reveal if email exists for security reasons
        return {
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        };
      }

      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedResetToken = await bcrypt.hash(resetToken, 10);
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Update user with reset token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          resetPasswordToken: hashedResetToken,
          resetPasswordExpires: resetTokenExpiry
        }
      });

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(email, resetToken);

      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      console.error('Error initiating password reset:', error);
      throw new HttpException(500, 'Error initiating password reset', { originalError: error });
    }
  }

  /**
   * Reset password with token
   */
  public async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find all users with password reset tokens that haven't expired
      const users = await this.prisma.user.findMany({
        where: {
          resetPasswordToken: { not: null },
          resetPasswordExpires: { gte: new Date() }
        }
      });

      // Check token against all users (since tokens are hashed)
      for (const user of users) {
        if (user.resetPasswordToken) {
          const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
          
          if (isTokenValid) {
            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update user password and clear reset token
            await this.prisma.user.update({
              where: { id: user.id },
              data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
              }
            });

            return {
              success: true,
              message: 'Password reset successfully'
            };
          }
        }
      }

      throw new HttpException(400, 'Invalid or expired reset token');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Error resetting password', { originalError: error });
    }
  }

  /**
   * Update user profile picture
   */
  public async updateProfilePicture(userId: number, file: MediaUpload): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { profilePictureId: true }
      });

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      // Upload new media
      const media = await this.mediaService.uploadMedia(file);

      // Update user with new profile picture
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { profilePictureId: media.id },
        include: {
          profilePicture: true
        }
      });

      // Clean up old profile picture if it exists
      if (user.profilePictureId) {
        try {
          await this.mediaService.deleteMedia(user.profilePictureId);
        } catch (error) {
          console.warn(`Failed to delete old profile picture ${user.profilePictureId}:`, error);
          // Don't throw error as the main operation succeeded
        }
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to update profile picture', { originalError: error });
    }
  }

  /**
   * Remove user profile picture
   */
  public async removeProfilePicture(userId: number): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { profilePictureId: true }
      });

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      if (!user.profilePictureId) {
        throw new HttpException(400, 'User has no profile picture to remove');
      }

      // Update user to remove profile picture
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: { profilePictureId: null }
      });

      // Delete the media file
      try {
        await this.mediaService.deleteMedia(user.profilePictureId);
      } catch (error) {
        console.warn(`Failed to delete profile picture ${user.profilePictureId}:`, error);
        // Don't throw error as the main operation succeeded
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to remove profile picture', { originalError: error });
    }
  }


}

export default UserService;
