import { Request, Response, NextFunction } from 'express';
import UserService from '../services/user.service';
import jwt from 'jsonwebtoken';
import { HttpException } from '../exceptions/HttpException';
import bcrypt from 'bcrypt';
import config from '../config';
import tokenBlacklistService from '../services/tokenBlacklist.service';

interface TokenPayload {
  id: number;
}

class AuthController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  /**
   * Register a new user - simple email/password/username registration
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, username } = req.body;
      const user = await this.userService.createUser(email, password, username);

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to verify your account.',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          emailVerified: user.emailVerified
        }
      });
    } catch (error) {
      next(error);
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
      const user = await this.userService.findUserByEmailUsername(userInfo);

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
      next(error);
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

      const user = await this.userService.findUserById(userId);

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      res.status(200).json({
        success: true,
        user
      });
    } catch (error) {
      next(error);
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

  /**
   * Verify user email with token
   */
  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.params;

      if (!token) {
        throw new HttpException(400, 'Verification token is required');
      }

      const result = await this.userService.verifyEmail(token);

      res.status(200).json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Resend email verification
   */
  public resendEmailVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new HttpException(400, 'Email is required');
      }

      const result = await this.userService.resendEmailVerification(email);

      res.status(200).json({
        success: result.success,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;