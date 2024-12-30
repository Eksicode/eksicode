import { Request, Response, NextFunction } from "express";
import UserService from "../services/user.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";

class UserController {
  private userService = new UserService();

  public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const summaryOnly = req.query.summaryOnly === "true";

      const { users, count }  = await this.userService.getAllUsers(
        skip,
        limit,
        summaryOnly,
      );

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        data: users,
        meta,
        message: "findAllUsers",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await this.userService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json(user);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await this.userService.updateUser(id, req.body);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const user = await this.userService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export default UserController;
