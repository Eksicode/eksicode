import { Request, Response, NextFunction } from 'express';
import RoleService from '../services/role.service';
import { HttpException } from '../exceptions/HttpException';

class RoleController {
  private roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  public createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      const role = await this.roleService.createRole(name, description);
      res.status(201).json({ role });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roles = await this.roleService.getAllRoles();
      res.status(200).json({ roles });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
}

export default RoleController; 