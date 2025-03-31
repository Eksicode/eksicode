import { Request, Response, NextFunction } from 'express';
import RoleService from '../services/role.service';
import PermissionService from '../services/permission.service';
import { HttpException } from '../exceptions/HttpException';

class RoleController {
  private roleService: RoleService;
  private permissionService: PermissionService;

  constructor() {
    this.roleService = new RoleService();
    this.permissionService = new PermissionService();
  }

  public createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description, permissionIds } = req.body;
      const role = await this.roleService.createRole(name, description, permissionIds);
      res.status(201).json({ role });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(400, error.message));
      }
    }
  };

  public getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const includePermissions = req.query.includePermissions === 'true';
      const roles = await this.roleService.getAllRoles(includePermissions);
      res.status(200).json({ roles });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  
  public getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const includePermissions = req.query.includePermissions === 'true';
      const role = await this.roleService.getRoleById(id, includePermissions);
      
      if (!role) {
        return next(new HttpException(404, `Role with ID ${id} not found`));
      }
      
      res.status(200).json({ role });
    } catch (error) {
      next(new HttpException(400, error.message));
    }
  };
  
  public updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { name, description, permissionIds } = req.body;
      
      const role = await this.roleService.updateRole(id, { name, description, permissionIds });
      res.status(200).json({ role });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(400, error.message));
      }
    }
  };
  
  public deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.roleService.deleteRole(id);
      res.status(200).json({ message: `Role with ID ${id} deleted successfully` });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(400, error.message));
      }
    }
  };
  
  public getRolePermissions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = parseInt(req.params.id, 10);
      const permissions = await this.roleService.getRolePermissions(roleId);
      res.status(200).json({ permissions });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(400, error.message));
      }
    }
  };
  
  public assignPermissionsToRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = parseInt(req.params.id, 10);
      const { permissionIds } = req.body;
      
      if (!Array.isArray(permissionIds)) {
        return next(new HttpException(400, 'permissionIds must be an array'));
      }
      
      await this.roleService.assignPermissionsToRole(roleId, permissionIds);
      res.status(200).json({ message: 'Permissions assigned successfully' });
    } catch (error) {
      if (error instanceof HttpException) {
        next(error);
      } else {
        next(new HttpException(400, error.message));
      }
    }
  };
}

export default RoleController;