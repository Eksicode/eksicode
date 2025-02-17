import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { Routes } from '../interfaces/routes.interface';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes(); 
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, this.authController.register);
    this.router.post(`${this.path}/login`, this.authController.login);
    this.router.post(`${this.path}/forgot-password`, this.authController.forgotPassword);
    this.router.post(`${this.path}/reset-password`, this.authController.resetPassword);
    this.router.get(`${this.path}/confirm-email/:token`, this.authController.confirmEmail);
  }
}

export default AuthRoute;