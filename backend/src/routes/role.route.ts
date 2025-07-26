import { Router } from 'express';
import RoleController from '../controllers/role.controller';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from "../middlewares/auth.middleware";
import RolePermissionService from '../services/rolePermission.service';
import UserService from '../services/user.service';

class RoleRoute implements Routes {
  public path = '/roles';
  public router = Router();
  public roleController: RoleController;

  constructor(rolePermissionService: RolePermissionService, userService: UserService) {
    this.roleController = new RoleController(rolePermissionService, userService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Role CRUD operations
    this.router.get(`${this.path}`, authMiddleware, this.roleController.getAllRoles);
    this.router.get(`${this.path}/:id`, authMiddleware, this.roleController.getRoleById);
    this.router.post(`${this.path}`, authMiddleware, this.roleController.createRole);
    this.router.put(`${this.path}/:id`, authMiddleware, this.roleController.updateRole);
    this.router.delete(`${this.path}/:id`, authMiddleware, this.roleController.deleteRole);

    // Role hierarchy
    this.router.get(`${this.path}/hierarchy`, authMiddleware, this.roleController.getRoleHierarchy);

    // Role-Permission management
    this.router.post(`${this.path}/:roleId/permissions`, authMiddleware, this.roleController.assignPermissionToRole);
    this.router.delete(`${this.path}/:roleId/permissions`, authMiddleware, this.roleController.removePermissionFromRole);
  }
}

export default RoleRoute;