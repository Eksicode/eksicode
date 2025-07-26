import { Request, Response, NextFunction } from 'express';
import RolePermissionService from '../services/rolePermission.service';
import UserService from '../services/user.service';
import { HttpException } from '../exceptions/HttpException';

class RoleController {
  private rolePermissionService: RolePermissionService;
  private userService: UserService;

  constructor(rolePermissionService: RolePermissionService, userService: UserService) {
    this.rolePermissionService = rolePermissionService;
    this.userService = userService;
  }

  public getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check admin permission
      const userId = req.userId;
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      const hasPermission = await this.userService.hasPermission(userId, 'admin.roles.view');
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const roles = await this.rolePermissionService.getAllRoles();

      res.status(200).json({
        success: true,
        data: roles,
        message: 'Roles retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roleId = parseInt(req.params.id, 10);
      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(roleId)) {
        throw new HttpException(400, 'Invalid role ID');
      }

      const hasPermission = await this.userService.hasPermission(userId, 'admin.roles.view');
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const role = await this.rolePermissionService.getRoleById(roleId);

      if (!role) {
        throw new HttpException(404, 'Role not found');
      }

      res.status(200).json({
        success: true,
        data: role,
        message: 'Role retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      const hasPermission = await this.userService.hasPermission(userId, 'admin.roles.create');
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const { name, description, parentId, level } = req.body;

      const role = await this.rolePermissionService.createRole({
        name,
        description,
        parentId,
        level,
      });

      res.status(201).json({
        success: true,
        data: role,
        message: 'Role created successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roleId = parseInt(req.params.id, 10);
      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(roleId)) {
        throw new HttpException(400, 'Invalid role ID');
      }

      const hasPermission = await this.userService.hasPermission(userId, 'admin.roles.update');
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const { name, description, parentId, level } = req.body;

      const role = await this.rolePermissionService.updateRole(roleId, {
        name,
        description,
        parentId,
        level,
      });

      res.status(200).json({
        success: true,
        data: role,
        message: 'Role updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roleId = parseInt(req.params.id, 10);
      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(roleId)) {
        throw new HttpException(400, 'Invalid role ID');
      }

      const hasPermission = await this.userService.hasPermission(userId, 'admin.roles.delete');
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      await this.rolePermissionService.deleteRole(roleId);

      res.status(200).json({
        success: true,
        message: 'Role deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public assignPermissionToRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roleId = parseInt(req.params.roleId, 10);
      const { permissionId } = req.body;
      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(roleId) || !permissionId) {
        throw new HttpException(400, 'Invalid role ID or permission ID');
      }

      const hasPermission = await this.userService.hasPermission(userId, 'admin.roles.permissions');
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      await this.rolePermissionService.assignPermissionToRole(roleId, permissionId);

      res.status(200).json({
        success: true,
        message: 'Permission assigned to role successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public removePermissionFromRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const roleId = parseInt(req.params.roleId, 10);
      const { permissionId } = req.body;
      const userId = req.userId;

      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(roleId) || !permissionId) {
        throw new HttpException(400, 'Invalid role ID or permission ID');
      }

      const hasPermission = await this.userService.hasPermission(userId, 'admin.roles.permissions');
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      await this.rolePermissionService.removePermissionFromRole(roleId, permissionId);

      res.status(200).json({
        success: true,
        message: 'Permission removed from role successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  public getRoleHierarchy = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      const hasPermission = await this.userService.hasPermission(userId, 'admin.roles.view');
      if (!hasPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      const hierarchy = await this.rolePermissionService.getRoleHierarchy();

      res.status(200).json({
        success: true,
        data: hierarchy,
        message: 'Role hierarchy retrieved successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

export default RoleController;