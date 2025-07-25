import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import MediaService from "../services/media.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";
import jwt from 'jsonwebtoken';
import config from '../config';
import { HttpException } from '../exceptions/HttpException';

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
      const { email, password, username } = req.body;
      const user = await this.userService.createUser(email, password, username);
      
      res.status(201).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          emailVerified: user.emailVerified
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
      const userId = req.userId;

      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      if (id !== userId) {
        throw new HttpException(403, "You can only update your own profile");
      }

      const user = await this.userService.updateUser(id, req.body);
      
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
      const userId = req.userId;

      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid user ID');
      }

      if (id !== userId) {
        throw new HttpException(403, "You can only delete your own profile");
      }

      const user = await this.userService.deleteUser(id);
      
      res.status(200).json({
        success: true,
        data: user,
        message: "User deleted successfully"
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
}

export default UserController;
