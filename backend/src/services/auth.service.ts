import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { HttpException } from '../exceptions/HttpException';
import EmailService from './email.service';
import config from '../config';
import tokenBlacklistService from './tokenBlacklist.service';

export interface TokenPayload {
  id: number;
  email: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: number;
    email: string;
    username: string;
    firstName?: string | null;
    lastName?: string | null;
    verified: boolean;
    emailVerified: boolean;
    lastLoginAt: Date | null;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    emailVerified: boolean;
  };
}

class AuthService {
  private prisma: PrismaClient;
  private emailService: EmailService;

  constructor(prisma: PrismaClient, emailService: EmailService) {
    this.prisma = prisma;
    this.emailService = emailService;
  }

  /**
   * Register a new user
   */
  public async register(email: string, password: string, username: string): Promise<RegisterResponse> {
    try {
      // Check if user already exists
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

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Generate email verification token
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

      // Send verification email
      await this.emailService.sendVerificationEmail(email, emailToken);

      return {
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          emailVerified: user.emailVerified,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Registration failed', { originalError: error });
    }
  }

  /**
   * Login user
   */
  public async login(userInfo: string, password: string): Promise<LoginResponse> {
    try {
      // Find user by email or username
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: userInfo.toLowerCase() },
            { username: userInfo.toLowerCase() },
          ],
          active: true, // Only allow active users to login
        },
        include: {
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
        },
      });

      if (!user) {
        throw new HttpException(401, 'Invalid credentials');
      }

      if (!user.emailVerified) {
        throw new HttpException(401, 'Please verify your email before logging in');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(401, 'Invalid credentials');
      }

      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email 
        } as TokenPayload,
        config.jwtSecret,
        { expiresIn: '7d' }
      );

      return {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          verified: user.verified,
          emailVerified: user.emailVerified,
          lastLoginAt: user.lastLoginAt,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Login failed', { originalError: error });
    }
  }

  /**
   * Logout user
   */
  public async logout(token: string): Promise<{ success: boolean; message: string }> {
    try {
      // Add token to blacklist
      tokenBlacklistService.blacklistToken(token);

      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error) {
      throw new HttpException(500, 'Logout failed', { originalError: error });
    }
  }

  /**
   * Verify email with token
   */
  public async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      // Find all users with email verification tokens
      const users = await this.prisma.user.findMany({
        where: {
          emailVerificationToken: { not: null },
          emailVerified: false,
          active: true,
        },
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
                emailVerificationToken: null,
              },
            });

            return {
              success: true,
              message: 'Email verified successfully',
            };
          }
        }
      }

      throw new HttpException(400, 'Invalid or expired verification token');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Email verification failed', { originalError: error });
    }
  }

  /**
   * Resend email verification
   */
  public async resendEmailVerification(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      if (user.emailVerified) {
        throw new HttpException(400, 'Email is already verified');
      }

      if (!user.active) {
        throw new HttpException(400, 'User account is inactive');
      }

      // Generate new verification token
      const emailToken = crypto.randomBytes(32).toString('hex');
      const hashedEmailToken = await bcrypt.hash(emailToken, 10);

      // Update user with new token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerificationToken: hashedEmailToken,
        },
      });

      // Send verification email
      await this.emailService.sendVerificationEmail(email, emailToken);

      return {
        success: true,
        message: 'Verification email sent',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to resend verification email', { originalError: error });
    }
  }

  /**
   * Initiate password reset process
   */
  public async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        // Don't reveal if email exists for security reasons
        return {
          success: true,
          message: 'If the email exists, a password reset link has been sent',
        };
      }

      if (!user.active) {
        return {
          success: true,
          message: 'If the email exists, a password reset link has been sent',
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
          resetPasswordExpires: resetTokenExpiry,
        },
      });

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(email, resetToken);

      return {
        success: true,
        message: 'Password reset email sent',
      };
    } catch (error) {
      console.error('Error initiating password reset:', error);
      throw new HttpException(500, 'Failed to initiate password reset', { originalError: error });
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
        },
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
                resetPasswordExpires: null,
              },
            });

            return {
              success: true,
              message: 'Password reset successfully',
            };
          }
        }
      }

      throw new HttpException(400, 'Invalid or expired reset token');
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to reset password', { originalError: error });
    }
  }

  /**
   * Assign default role to new user
   */
  private async assignDefaultRole(userId: number): Promise<void> {
    try {
      // Find or create default user role
      let userRole = await this.prisma.role.findUnique({
        where: { name: 'user' },
      });

      if (!userRole) {
        userRole = await this.prisma.role.create({
          data: {
            name: 'user',
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
      // Don't throw error as it's not critical for registration
    }
  }

  /**
   * Validate JWT token
   */
  public async validateToken(token: string): Promise<TokenPayload> {
    try {
      // Check if token is blacklisted
      if (tokenBlacklistService.isTokenBlacklisted(token)) {
        throw new HttpException(401, 'Token has been invalidated');
      }

      // Verify JWT token
      const payload = jwt.verify(token, config.jwtSecret) as TokenPayload;

      // Check if user still exists and is active
      const user = await this.prisma.user.findUnique({
        where: { 
          id: payload.id,
          active: true,
        },
      });

      if (!user) {
        throw new HttpException(401, 'Invalid token - user not found or inactive');
      }

      return payload;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(401, 'Invalid token');
    }
  }
}

export default AuthService;
