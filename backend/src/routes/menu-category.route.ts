import { Router } from "express";
import MenuCategoryController from "../controllers/menu-category.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";

class MenuCategoryRoute implements Routes {
  public path = "/menu-categories";
  public router = Router();
  public menuCategoryController = new MenuCategoryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.menuCategoryController.getAllMenuCategories);
    this.router.get(`${this.path}/:id`, this.menuCategoryController.getMenuCategoryById);
    
    // Protected routes
    this.router.post(
      `${this.path}`,
      authMiddleware,
      this.menuCategoryController.createMenuCategory
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      this.menuCategoryController.updateMenuCategory
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      this.menuCategoryController.deleteMenuCategory
    );
  }
}

export default MenuCategoryRoute; 