import { Router } from "express";
import MenuController from "../controllers/menu.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
class MenuRoute implements Routes {
  public path = "/menus";
  public router = Router();
  public menuController = new MenuController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.menuController.getAllMenus);
    this.router.get(`${this.path}/:id`, this.menuController.getMenuById);
    this.router.get(
      `${this.path}/category/:categoryId`,
      this.menuController.getMenusByCategory
    );
    
    // Protected routes requiring authentication
    this.router.post(
      `${this.path}`,
      authMiddleware,
      roleMiddleware(['admin', 'superadmin']),
      this.menuController.createMenu
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware(['admin', 'superadmin']),
      this.menuController.updateMenu
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware(['admin', 'superadmin']),
      this.menuController.deleteMenu
    );
  }
}

export default MenuRoute; 