import { Router } from 'express';
import PermissionController from '../controllers/permission.controller';
import { Routes } from '../interfaces/routes.interface';

class PermissionRoute implements Routes {
  public path = '/permissions';
  public router = Router();
  public permissionController = new PermissionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.permissionController.createPermission);
    this.router.get(`${this.path}`, this.permissionController.getAllPermissions);
  }
}

export default PermissionRoute; 