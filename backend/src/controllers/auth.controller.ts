import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import { HttpException } from '../exceptions/HttpException';

class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor(authService: AuthService, userService: UserService) {
    this.authService = authService;
    this.userService = userService;
  }

  /**
   * Register a new user
   */
  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, username } = req.body;
      const result = await this.authService.register(email, password, username);

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   */
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userInfo, password } = req.body;

      // Validation is already handled by Zod middleware, but keep this as a safety check
      // for cases where validation middleware might not be applied
      if (!userInfo || !password) {
        throw new HttpException(400, 'Email/username and password are required');
      }

      const result = await this.authService.login(userInfo, password);

      res.status(200).json(result);
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

      const user = await this.userService.findUserById(userId, userId);

      if (!user) {
        throw new HttpException(404, 'User not found');
      }

      res.status(200).json({
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Logout user
   */
  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.token;
      
      if (!token) {
        throw new HttpException(400, 'No token found in request');
      }

      const result = await this.authService.logout(token);

      res.status(200).json(result);
    } catch (error) {
      next(error instanceof HttpException ? error : new HttpException(500, 'Logout failed'));
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

      const result = await this.authService.verifyEmail(token);

      res.status(200).json(result);
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

      const result = await this.authService.resendEmailVerification(email);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Initiate password reset process
   */
  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new HttpException(400, 'Email is required');
      }

      const result = await this.authService.forgotPassword(email);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Reset password with token
   */
  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        throw new HttpException(400, 'Token and new password are required');
      }

      const result = await this.authService.resetPassword(token, newPassword);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get blacklist statistics (for monitoring/admin purposes)
   */
  public getBlacklistStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check if user has admin privileges
      const userId = req.userId;
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      const hasAdminPermission = await this.userService.hasPermission(userId, 'admin.access');
      if (!hasAdminPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      // Get blacklist stats (implementation depends on your token blacklist service)
      const blacklistSize = 0; // Replace with actual implementation
      
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