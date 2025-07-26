import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';
import authLimiter from '../middlewares/rateLimiter';
import authMiddleware from '../middlewares/auth.middleware';
import { validate } from '../middlewares/zod.middleware';
import { 
  registerSchema, 
  loginSchema, 
  resendVerificationSchema, 
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema 
} from '../types/auth.zod';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController: AuthController;

  constructor(authService: AuthService, userService: UserService) {
    this.authController = new AuthController(authService, userService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.post(
      `${this.path}/register`, 
      authLimiter, 
      validate(registerSchema),
      this.authController.register
    );
    
    this.router.post(
      `${this.path}/login`, 
      authLimiter, 
      validate(loginSchema),
      this.authController.login
    );

    // Email verification routes
    this.router.get(
      `${this.path}/verify-email/:token`,
      validate(verifyEmailSchema),
      this.authController.verifyEmail
    );

    this.router.post(
      `${this.path}/resend-verification`,
      authLimiter,
      validate(resendVerificationSchema),
      this.authController.resendEmailVerification
    );

    // Password reset routes
    this.router.post(
      `${this.path}/forgot-password`,
      authLimiter,
      validate(forgotPasswordSchema),
      this.authController.forgotPassword
    );

    this.router.post(
      `${this.path}/reset-password`,
      authLimiter,
      validate(resetPasswordSchema),
      this.authController.resetPassword
    );
    
    // Protected routes
    this.router.get(
      `${this.path}/me`, 
      authMiddleware, 
      authLimiter, 
      this.authController.me
    );
    
    this.router.post(
      `${this.path}/logout`, 
      authMiddleware, 
      this.authController.logout
    );

    // Admin/monitoring route
    this.router.get(
      `${this.path}/blacklist-stats`, 
      authMiddleware, 
      this.authController.getBlacklistStats
    );
  }
}

export default AuthRoute;