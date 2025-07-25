import { Router } from "express";
import UserController from "../controllers/user.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
import selfMiddleware from "../middlewares/self.middleware";
import { uploadSingle, handleUploadError } from "../middlewares/upload.middleware";
import UserService from "../services/user.service";

class UserRoute implements Routes {
  public path = "/users";
  public router = Router();
  public userController: UserController;

  constructor(userService: UserService) {
    this.userController = new UserController(userService);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, roleMiddleware(), this.userController.getAllUsers); // GET /users
    this.router.get(`${this.path}/:id`, authMiddleware, selfMiddleware, roleMiddleware(), this.userController.getUserById); // GET /users/:id
    this.router.post(`${this.path}`, authMiddleware, selfMiddleware, roleMiddleware(), this.userController.createUser); // POST /users
    this.router.put(`${this.path}/:id`, authMiddleware, selfMiddleware, roleMiddleware(), this.userController.updateUser); // PUT /users/:id
    this.router.delete(`${this.path}/:id`, authMiddleware, selfMiddleware, roleMiddleware(), this.userController.deleteUser); // DELETE /users/:id
    
    // Profile picture upload routes
    this.router.post(`${this.path}/me/profile-picture`, 
      authMiddleware, 
      uploadSingle('profilePicture'), 
      handleUploadError,
      this.userController.uploadProfilePicture
    ); // POST /users/me/profile-picture
    
    this.router.delete(`${this.path}/me/profile-picture`, 
      authMiddleware, 
      this.userController.removeProfilePicture
    ); // DELETE /users/me/profile-picture
  }
}

export default UserRoute;
