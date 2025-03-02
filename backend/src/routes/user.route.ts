import { Router } from "express";
import UserController from "../controllers/user.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import selfMiddleware from "@middlewares/self.middleware";

class UserRoute implements Routes {
  public path = "/users";
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, roleMiddleware(['admin', 'superadmin']), this.userController.getAllUsers); // GET /users
    this.router.get(`${this.path}/:id`, authMiddleware, selfMiddleware, roleMiddleware(['admin', 'superadmin']), this.userController.getUserById); // GET /users/:id
    this.router.post(`${this.path}`, authMiddleware, selfMiddleware, roleMiddleware(['admin', 'superadmin']), this.userController.createUser); // POST /users
    this.router.put(`${this.path}/:id`, authMiddleware, selfMiddleware, roleMiddleware(['admin', 'superadmin']), this.userController.updateUser); // PUT /users/:id
    this.router.delete(`${this.path}/:id`, authMiddleware, selfMiddleware, roleMiddleware(['admin', 'superadmin']), this.userController.deleteUser); // DELETE /users/:id
  }
}

export default UserRoute;
