import { Request, Response, NextFunction } from "express";
import MenuCategoryService from "../services/menu-category.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";

class MenuCategoryController {
  private menuCategoryService = new MenuCategoryService();

  public getAllMenuCategories = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const { categories, count } = await this.menuCategoryService.getAllMenuCategories(skip, limit);
      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        data: categories,
        meta,
        message: "findAllMenuCategories",
      });
    } catch (error) {
      next(error);
    }
  };

  public getMenuCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const category = await this.menuCategoryService.getMenuCategoryById(id);
      res.status(200).json({ data: category, message: "findMenuCategory" });
    } catch (error) {
      next(error);
    }
  };

  public createMenuCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const category = await this.menuCategoryService.createMenuCategory(req.body);
      res.status(201).json({ data: category, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateMenuCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const category = await this.menuCategoryService.updateMenuCategory(id, req.body);
      res.status(200).json({ data: category, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteMenuCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const category = await this.menuCategoryService.deleteMenuCategory(id);
      res.status(200).json({ data: category, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}

export default MenuCategoryController; 