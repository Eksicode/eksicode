import { Request, Response, NextFunction } from 'express';
import PermissionService from '../services/permission.service';
import { HttpException } from '../exceptions/HttpException';

class PermissionController {
  private permissionService: PermissionService;

  constructor() {
    this.permissionService = new PermissionService();
  }

  public createPermission = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      const permission = await this.permissionService.createPermission(name, description);
      res.status(201).json({ permission });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };

  public getAllPermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const permissions = await this.permissionService.getAllPermissions();
      res.status(200).json({ permissions });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
}

export default PermissionController; 