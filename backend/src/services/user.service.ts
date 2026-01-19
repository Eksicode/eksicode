import { PrismaClient, User, Role, Permission, UserRole, UserPermission } from '@prisma/client';
import bcrypt from 'bcrypt';
import { HttpException } from '../exceptions/HttpException';
import crypto from 'crypto';
import EmailService from './email.service';
import MediaService, { MediaUpload } from './media.service';
import config from '../config';
import { RoleGuard } from '../utils/roleGuard';
import { PERMISSIONS } from '../constants/permissions';
import { ROLE_NAMES } from '../constants/roles';

// Extended types for user with relations
export interface UserWithRoles extends User {
  userRoles: (UserRole & {
    role: Role & {
      permissions: Permission[];
    };
  })[];
  userPermissions: (UserPermission & {
    permission: Permission;
  })[];
  profilePicture?: {
    id: number;
    url: string;
    altText: string | null;
    type: string;
  } | null;
}

export interface SafeUser {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  profilePicture?: {
    id: number;
    url: string;
    altText: string | null;
    type: string;
  } | null;
  birthday: Date | null;
  linkedin: string | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
  instagram: string | null;
  facebook: string | null;
  verified: boolean;
  emailVerified: boolean;
  active: boolean;
  lastLoginAt: Date | null;
  roles: string[];
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

class UserService {
  private prisma: PrismaClient;
  private emailService: EmailService;
  private mediaService: MediaService;
  private roleGuard: RoleGuard;

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
    active: true,
    lastLoginAt: true,
    userRoles: {
      where: { active: true },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    },
    userPermissions: {
      where: { active: true },
      include: {
        permission: true,
      },
    },
    createdAt: true,
    updatedAt: true,
  };

  constructor(prisma: PrismaClient, emailService: EmailService, mediaService?: MediaService) {
    this.prisma = prisma;
    this.emailService = emailService;
    this.mediaService = mediaService || new MediaService(prisma);
    this.roleGuard = new RoleGuard(prisma);
  }

  /**
   * Transform user data to safe format with roles and permissions as string arrays
   */
  private transformUserToSafe(user: any): SafeUser {
    const roles = user.userRoles?.map((ur: any) => ur.role.name) || [];
    const permissions = [
      ...(user.userRoles?.flatMap((ur: any) => ur.role.permissions.map((p: any) => p.name)) || []),
      ...(user.userPermissions?.map((up: any) => up.permission.name) || [])
    ];

    // Remove duplicates from permissions
    const uniquePermissions = [...new Set(permissions)];

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profilePicture: user.profilePicture,
      birthday: user.birthday,
      linkedin: user.linkedin,
      website: user.website,
      github: user.github,
      twitter: user.twitter,
      instagram: user.instagram,
      facebook: user.facebook,
      verified: user.verified,
      emailVerified: user.emailVerified,
      active: user.active,
      lastLoginAt: user.lastLoginAt,
      roles: roles,
      permissions: uniquePermissions,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Get all users
   */
  public async getAllUsers(
    skip: number,
    limit: number,
    summaryOnly: boolean
  ): Promise<{ users: SafeUser[]; count: number }> {
    const [users, count] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where: { active: true }, // Only return active users
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
              active: true,
              createdAt: true,
            }
          : this.safeUserSelect,
      }),
      this.prisma.user.count({ where: { active: true } }),
    ]);

    // Transform users to include roles and permissions as string arrays
    const transformedUsers = users.map(user => this.transformUserToSafe(user as any));
    
    return { users: transformedUsers, count };
  }

  /**
   * Get user by ID
   */
  async findUserById(id: number | string, requestingUserId?: number): Promise<SafeUser> {
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
  
      return this.transformUserToSafe(user);
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
      const user = await this.roleGuard.loadUserWithPermissions(userId);
      if (!user) return false;
      return this.roleGuard.isAdmin(user);
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
        id: userId,
        active: true,
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
        active: true,
        lastLoginAt: true,
        userRoles: {
          where: { active: true },
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
        },
        userPermissions: {
          where: { active: true },
          include: {
            permission: true,
          },
        },
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
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser?.email === email.toLowerCase()) {
      throw new HttpException(400, 'Email already in use');
    }
    if (existingUser?.username === username.toLowerCase()) {
      throw new HttpException(400, 'Username already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const emailToken = crypto.randomBytes(32).toString('hex');
    const hashedEmailToken = await bcrypt.hash(emailToken, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        username: username.toLowerCase(),
        emailVerificationToken: hashedEmailToken,
        emailVerified: false,
        active: true,
      },
    });

    // Assign default user role
    await this.assignDefaultRole(user.id);
    
    await this.emailService.sendVerificationEmail(email, emailToken);

    return user;
  }

  /**
   * Assign default role to new user
   */
  private async assignDefaultRole(userId: number): Promise<void> {
    try {
      // Find or create default user role
      let userRole = await this.prisma.role.findUnique({
        where: { name: ROLE_NAMES.USER },
      });

      if (!userRole) {
        userRole = await this.prisma.role.create({
          data: {
            name: ROLE_NAMES.USER,
            description: 'Default user role',
            level: 100, // Lowest level
            active: true,
          },
        });
      }

      // Assign role to user
      await this.prisma.userRole.create({
        data: {
          userId,
          roleId: userRole.id,
          assignedAt: new Date(),
          active: true,
        },
      });
    } catch (error) {
      console.error('Failed to assign default role:', error);
      // Don't throw error as it's not critical for user creation
    }
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
          { email: userInfo.toLowerCase() },
          { username: userInfo.toLowerCase() },
        ],
        active: true, // Only find active users
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
    console.log(`Finding user by email: ${email}`);
    const user = await this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
        active: true, // Only find active users
      },
    });
    console.log(`User found: ${user ? 'Yes' : 'No'}`);
    return user;
  }


  /**
   * Assign a role to a user
   */
  public async assignRoleToUser(userId: number, roleName: string, assignedById?: number): Promise<void> {
    // Find the role
    const role = await this.prisma.role.findUnique({
      where: { name: roleName, active: true },
    });

    if (!role) {
      throw new HttpException(400, `Role '${roleName}' not found`);
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId, active: true },
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    // Check if user already has this role
    const existingUserRole = await this.prisma.userRole.findFirst({
      where: {
        userId,
        roleId: role.id,
        active: true,
      },
    });

    if (existingUserRole) {
      return; // Role already assigned
    }

    // Assign the role
    await this.prisma.userRole.create({
      data: {
        userId,
        roleId: role.id,
        assignedById,
        assignedAt: new Date(),
        active: true,
      },
    });
  }

  /**
   * Get user roles
   */
  public async getUserRoles(userId: number): Promise<string[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { 
        userId, 
        active: true,
        role: { active: true }
      },
      include: {
        role: true,
      },
    });

    return userRoles.map(ur => ur.role.name);
  }

  /**
   * Remove a role from a user
   */
  public async removeRoleFromUser(userId: number, roleName: string): Promise<void> {
    try {
      // Find the role
      const role = await this.prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!role) {
        throw new HttpException(400, `Role '${roleName}' not found`);
      }

      // Find and deactivate the user role
      const userRole = await this.prisma.userRole.findFirst({
        where: {
          userId,
          roleId: role.id,
          active: true,
        },
      });

      if (!userRole) {
        return; // Role not assigned to user
      }

      // Deactivate instead of deleting for audit trail
      await this.prisma.userRole.update({
        where: { id: userRole.id },
        data: { active: false },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to remove role from user', { originalError: error });
    }
  }

  /**
   * Check if a user has a specific permission
   */
  public async hasPermission(userId: number, permissionName: string): Promise<boolean> {
    try {
      const user = await this.roleGuard.loadUserWithPermissions(userId);
      if (!user) return false;
      return this.roleGuard.hasPermission(user, permissionName);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }

  /**
   * Get all permissions for a user (both direct and role-based)
   */
  public async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const user = await this.roleGuard.loadUserWithPermissions(userId);
      if (!user) return [];
      
      const permissions = this.roleGuard.getUserPermissions(user);
      return Array.from(permissions);
    } catch (error) {
      console.error('Error getting user permissions:', error);
      return [];
    }
  }

  /**
   * Assign a permission directly to a user
   */
  public async assignPermissionToUser(userId: number, permissionName: string, assignedById?: number): Promise<void> {
    // Find the permission
    const permission = await this.prisma.permission.findUnique({
      where: { name: permissionName, active: true },
    });

    if (!permission) {
      throw new HttpException(400, `Permission '${permissionName}' not found`);
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId, active: true },
    });

    if (!user) {
      throw new HttpException(404, 'User not found');
    }

    // Check if user already has this permission
    const existingUserPermission = await this.prisma.userPermission.findFirst({
      where: {
        userId,
        permissionId: permission.id,
        active: true,
      },
    });

    if (existingUserPermission) {
      return; // Permission already assigned
    }

    // Assign the permission
    await this.prisma.userPermission.create({
      data: {
        userId,
        permissionId: permission.id,
        assignedById,
        assignedAt: new Date(),
        active: true,
      },
    });
  }

  /**
   * Remove a permission from a user
   */
  public async removePermissionFromUser(userId: number, permissionName: string): Promise<void> {
    try {
      // Find the permission
      const permission = await this.prisma.permission.findUnique({
        where: { name: permissionName },
      });

      if (!permission) {
        throw new HttpException(400, `Permission '${permissionName}' not found`);
      }

      // Find and deactivate the user permission
      const userPermission = await this.prisma.userPermission.findFirst({
        where: {
          userId,
          permissionId: permission.id,
          active: true,
        },
      });

      if (!userPermission) {
        return; // Permission not assigned to user
      }

      // Deactivate instead of deleting for audit trail
      await this.prisma.userPermission.update({
        where: { id: userPermission.id },
        data: { active: false },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
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
          emailVerified: false,
          active: true,
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
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      if (!user.active) {
        throw new HttpException(400, 'User account is inactive');
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
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        // Don't reveal if email exists for security reasons
        return {
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        };
      }

      if (!user.active) {
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
          resetPasswordExpires: { gte: new Date() },
          active: true,
        }
      });

      // Check token against all users (since tokens are hashed)
      for (const user of users) {
        if (user.resetPasswordToken) {
          const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);
          
          if (isTokenValid) {
            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 12);

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

