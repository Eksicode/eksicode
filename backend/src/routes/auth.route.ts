import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';
import authLimiter from '../middlewares/rateLimiter';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes(); 
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, authLimiter, this.authController.register);
    this.router.post(`${this.path}/login`, authLimiter, this.authController.login);
    this.router.post(`${this.path}/forgot-password`, authLimiter, this.authController.forgotPassword);
    this.router.post(`${this.path}/reset-password`, authLimiter, this.authController.resetPassword);
    this.router.get(`${this.path}/confirm-email/:token`, authLimiter, this.authController.confirmEmail);
  }
}

export default AuthRoute;