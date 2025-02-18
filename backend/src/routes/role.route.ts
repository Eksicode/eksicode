import { Router } from 'express';
import RoleController from '../controllers/role.controller';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from "../middlewares/auth.middleware";

class RoleRoute implements Routes {
  public path = '/roles';
  public router = Router();
  public roleController = new RoleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware,  this.roleController.createRole);
    this.router.get(`${this.path}`, authMiddleware, this.roleController.getAllRoles);
  }
}

export default RoleRoute; 