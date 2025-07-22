import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';
import authLimiter from '../middlewares/rateLimiter';
import authMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import { RegisterDto, LoginDto } from '../types/auth.dto';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes(); 
  }

  private initializeRoutes() {
    // Public routes
    this.router.post(
      `${this.path}/register`, 
      authLimiter, 
      validationMiddleware(RegisterDto, 'body'),
      this.authController.register
    );
    
    this.router.post(
      `${this.path}/login`, 
      authLimiter, 
      validationMiddleware(LoginDto, 'body'),
      this.authController.login
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