import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import MediaService from "../services/media.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";
import { HttpException } from '../exceptions/HttpException';
import { PERMISSIONS } from '../constants/permissions';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class UserController {
  private userService: UserService;
  private mediaService: MediaService;

  constructor(userService: UserService, mediaService?: MediaService) {
    this.userService = userService;
    this.mediaService = mediaService || new MediaService(userService['prisma']);
  }

  public getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const summaryOnly = req.query.summaryOnly === "true";

      const { users, count } = await this.userService.getAllUsers(
        skip,
        limit,
        summaryOnly
      );

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        success: true,
        data: users,
        meta,
        message: "Users retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const requestingUserId = req.userId;
      
      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid user ID');
      }
      
      const user = await this.userService.findUserById(id, requestingUserId);
      
      res.status(200).json({
        success: true,
        data: user,
        message: "User retrieved successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Check if requesting user has admin privileges
      const requestingUserId = req.userId;
      if (!requestingUserId) {
        throw new HttpException(401, 'Authentication required');
      }

      const hasAdminPermission = await this.userService.hasPermission(requestingUserId, PERMISSIONS.CREATE_USER);
      if (!hasAdminPermission) {
        throw new HttpException(403, 'Admin access required to create users');
      }

      const { email, password, username } = req.body;
      const user = await this.userService.createUser(email, password, username);
      
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          emailVerified: user.emailVerified,
          active: user.active
        },
        message: "User created successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const requestingUserId = req.userId;

      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      if (!requestingUserId) {
        throw new HttpException(401, 'Authentication required');
      }

      // Check if user can update this profile
      if (id !== requestingUserId) {
        const hasAdminPermission = await this.userService.hasPermission(requestingUserId, PERMISSIONS.UPDATE_USER);
        if (!hasAdminPermission) {
          throw new HttpException(403, "You can only update your own profile");
        }
      }

      // Filter out sensitive fields that shouldn't be updated directly
      const { password, email, emailVerified, emailVerificationToken, resetPasswordToken, resetPasswordExpires, ...updateData } = req.body;

      const user = await this.userService.updateUser(id, updateData);
      
      res.status(200).json({
        success: true,
        data: user,
        message: "User updated successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const requestingUserId = req.userId;

      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      if (!requestingUserId) {
        throw new HttpException(401, 'Authentication required');
      }

      // Check if user can delete this profile
      if (id !== requestingUserId) {
        const hasAdminPermission = await this.userService.hasPermission(requestingUserId, PERMISSIONS.DELETE_USER);
        if (!hasAdminPermission) {
          throw new HttpException(403, "You can only delete your own profile");
        }
      }

      // Instead of deleting, we'll deactivate the user
      const user = await this.userService.updateUser(id, { active: false });
      
      res.status(200).json({
        success: true,
        data: user,
        message: "User deactivated successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadProfilePicture = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (!req.file) {
        throw new HttpException(400, 'No file uploaded');
      }

      const mediaUpload = {
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        size: req.file.size,
        altText: req.body.altText || `Profile picture for user ${userId}`
      };

      const user = await this.userService.updateProfilePicture(userId, mediaUpload);
      
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          profilePicture: (user as any).profilePicture
        },
        message: "Profile picture updated successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public removeProfilePicture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        throw new HttpException(401, 'Authentication required');
      }

      const user = await this.userService.removeProfilePicture(userId);
      
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          profilePicture: null
        },
        message: "Profile picture removed successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  // Role management endpoints
  public assignRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const { roleName } = req.body;
      const requestingUserId = req.userId;

      if (!requestingUserId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(userId)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      // Check admin permission
      const hasAdminPermission = await this.userService.hasPermission(requestingUserId, PERMISSIONS.MANAGE_USER_ROLES);
      if (!hasAdminPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      await this.userService.assignRoleToUser(userId, roleName, requestingUserId);

      res.status(200).json({
        success: true,
        message: `Role '${roleName}' assigned successfully`
      });
    } catch (error) {
      next(error);
    }
  };

  public removeRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const { roleName } = req.body;
      const requestingUserId = req.userId;

      if (!requestingUserId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(userId)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      // Check admin permission
      const hasAdminPermission = await this.userService.hasPermission(requestingUserId, PERMISSIONS.MANAGE_USER_ROLES);
      if (!hasAdminPermission) {
        throw new HttpException(403, 'Admin access required');
      }

      await this.userService.removeRoleFromUser(userId, roleName);

      res.status(200).json({
        success: true,
        message: `Role '${roleName}' removed successfully`
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const requestingUserId = req.userId;

      if (!requestingUserId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(userId)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      // Check if user can view roles (own profile or admin)
      if (userId !== requestingUserId) {
        const hasAdminPermission = await this.userService.hasPermission(requestingUserId, PERMISSIONS.VIEW_USER);
        if (!hasAdminPermission) {
          throw new HttpException(403, 'Access denied');
        }
      }

      const roles = await this.userService.getUserRoles(userId);

      res.status(200).json({
        success: true,
        data: roles,
        message: 'User roles retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  public getUserPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const requestingUserId = req.userId;

      if (!requestingUserId) {
        throw new HttpException(401, 'Authentication required');
      }

      if (isNaN(userId)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      // Check if user can view permissions (own profile or admin)
      if (userId !== requestingUserId) {
        const hasAdminPermission = await this.userService.hasPermission(requestingUserId, PERMISSIONS.VIEW_USER);
        if (!hasAdminPermission) {
          throw new HttpException(403, 'Access denied');
        }
      }

      const permissions = await this.userService.getUserPermissions(userId);

      res.status(200).json({
        success: true,
        data: permissions,
        message: 'User permissions retrieved successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
