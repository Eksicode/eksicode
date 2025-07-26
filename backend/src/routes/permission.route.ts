import { Router } from 'express';
import PermissionController from '../controllers/permission.controller';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from "../middlewares/auth.middleware";
import RolePermissionService from '../services/rolePermission.service';
import UserService from '../services/user.service';

class PermissionRoute implements Routes {
  public path = '/permissions';
  public router = Router();
  public permissionController: PermissionController;

  constructor(rolePermissionService: RolePermissionService, userService: UserService) {
    this.permissionController = new PermissionController(rolePermissionService, userService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Permission CRUD operations
    this.router.get(`${this.path}`, authMiddleware, this.permissionController.getAllPermissions);
    this.router.get(`${this.path}/:id`, authMiddleware, this.permissionController.getPermissionById);
    this.router.post(`${this.path}`, authMiddleware, this.permissionController.createPermission);
    this.router.put(`${this.path}/:id`, authMiddleware, this.permissionController.updatePermission);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.permissionController.deletePermission);

    // Permission categorization
    this.router.get(`${this.path}/categories`, authMiddleware, this.permissionController.getPermissionsByCategory);
  }
}

export default PermissionRoute; 