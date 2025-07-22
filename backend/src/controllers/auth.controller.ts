import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import jwt from 'jsonwebtoken';
import { HttpException } from '../exceptions/HttpException';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import config from '../config';
import tokenBlacklistService from '../services/tokenBlacklist.service';

const prisma = new PrismaClient();

interface TokenPayload {
  id: number;
}

class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Register a new user - simple email/password/username registration
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, username } = req.body;

      if (!email || !password || !username) {
        throw new HttpException(400, 'Email, password, and username are required');
      }

      if (password.length < 8) {
        throw new HttpException(400, 'Password must be at least 8 characters long');
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        throw new HttpException(409, 'User with this email or username already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
          verified: true,  // No email verification - keep it simple
          emailVerified: true
        },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user
      });
    } catch (error) {
      next(error instanceof HttpException ? error : new HttpException(500, 'Registration failed'));
    }
  };

  /**
   * Login user - simple email/username + password authentication
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userInfo, password } = req.body;

      if (!userInfo || !password) {
        throw new HttpException(400, 'Email/username and password are required');
      }

      // Find user by email or username
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: userInfo },
            { username: userInfo }
          ]
        }
      });

      if (!user) {
        throw new HttpException(401, 'Invalid credentials');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(401, 'Invalid credentials');
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id }, 
        config.jwtSecret, 
        { expiresIn: '7d' }  // Simple 7-day expiry
      );

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      next(error instanceof HttpException ? error : new HttpException(500, 'Login failed'));
    }
  };

  /**
   * Get current user information
   */
  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          profilePicture: true,
          verified: true,
          roles: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      next(error instanceof HttpException ? error : new HttpException(500, 'Failed to get user info'));
    }
  };

  /**
   * Logout user - blacklist the current token
   */
  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.token;
      
      if (!token) {
        throw new HttpException(400, 'No token found in request');
      }

      // Add token to blacklist
      tokenBlacklistService.blacklistToken(token);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error instanceof HttpException ? error : new HttpException(500, 'Logout failed'));
    }
  };

  /**
   * Get blacklist statistics (for monitoring/admin purposes)
   */
  public getBlacklistStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const blacklistSize = tokenBlacklistService.getBlacklistSize();
      
      res.status(200).json({
        success: true,
        stats: {
          blacklistedTokens: blacklistSize
        }
      });
    } catch (error) {
      next(error instanceof HttpException ? error : new HttpException(500, 'Failed to get blacklist stats'));
    }
  };
}

export default AuthController;