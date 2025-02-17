import { Router } from 'express';
import RoleController from '../controllers/role.controller';
import { Routes } from '../interfaces/routes.interface';

class RoleRoute implements Routes {
  public path = '/roles';
  public router = Router();
  public roleController = new RoleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, this.roleController.createRole);
    this.router.get(`${this.path}`, this.roleController.getAllRoles);
  }
}

export default RoleRoute; 