import { Request, Response, NextFunction } from 'express';
import RolePermissionService from '../services/rolePermission.service';
import UserService from '../services/user.service';
import { HttpException } from '../exceptions/HttpException';
import { PERMISSIONS } from '../constants/permissions';

class PermissionController {
  private rolePermissionService: RolePermissionService;
  private userService: UserService;

  constructor(rolePermissionService: RolePermissionService, userService: UserService) {
    this.rolePermissionService = rolePermissionService;
    this.userService = userService;
  }

  public getAllPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check admin permission
      const userId = req.userId;
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      const hasPermission = await this.userService.hasPermission(userId, PERMISSIONS.VIEW_ADMIN_PANEL);
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const permissions = await this.rolePermissionService.getAllPermissions();

      res.status(200).json({
        success: true,
        data: permissions,
        message: 'Permissions retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public getPermissionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const permissionId = parseInt(req.params.id, 10);
      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(permissionId)) {
        throw new HttpException(400, 'Invalid permission ID');
      }

      const hasPermission = await this.userService.hasPermission(userId, PERMISSIONS.VIEW_ADMIN_PANEL);
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const permission = await this.rolePermissionService.getPermissionById(permissionId);

      if (!permission) {
        throw new HttpException(404, 'Permission not found');
      }

      res.status(200).json({
        success: true,
        data: permission,
        message: 'Permission retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public createPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      const hasPermission = await this.userService.hasPermission(userId, PERMISSIONS.MANAGE_PERMISSIONS);
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const { name, description, category, resource, action } = req.body;

      const permission = await this.rolePermissionService.createPermission({
        name,
        description,
        category,
        resource,
        action,
      });

      res.status(201).json({
        success: true,
        data: permission,
        message: 'Permission created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public updatePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const permissionId = parseInt(req.params.id, 10);
      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(permissionId)) {
        throw new HttpException(400, 'Invalid permission ID');
      }

      const hasPermission = await this.userService.hasPermission(userId, PERMISSIONS.MANAGE_PERMISSIONS);
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const { name, description, category, resource, action } = req.body;

      const permission = await this.rolePermissionService.updatePermission(permissionId, {
        name,
        description,
        category,
        resource,
        action,
      });

      res.status(200).json({
        success: true,
        data: permission,
        message: 'Permission updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public deletePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const permissionId = parseInt(req.params.id, 10);
      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(permissionId)) {
        throw new HttpException(400, 'Invalid permission ID');
      }

      const hasPermission = await this.userService.hasPermission(userId, PERMISSIONS.MANAGE_PERMISSIONS);
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      await this.rolePermissionService.deletePermission(permissionId);

      res.status(200).json({
        success: true,
        message: 'Permission deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public getPermissionsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      const hasPermission = await this.userService.hasPermission(userId, PERMISSIONS.VIEW_ADMIN_PANEL);
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const permissionsByCategory = await this.rolePermissionService.getPermissionsByCategory();

      res.status(200).json({
        success: true,
        data: permissionsByCategory,
        message: 'Permissions by category retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default PermissionController; 