import { Router } from 'express';
import PermissionController from '../controllers/permission.controller';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
class PermissionRoute implements Routes {
  public path = '/permissions';
  public router = Router();
  public permissionController = new PermissionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, roleMiddleware(['admin', 'superadmin']), this.permissionController.createPermission);
    this.router.get(`${this.path}`, authMiddleware, roleMiddleware(['admin', 'superadmin']), this.permissionController.getAllPermissions);
  }
}

export default PermissionRoute; 