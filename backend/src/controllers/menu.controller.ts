import { Request, Response, NextFunction } from "express";
import MenuService from "../services/menu.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";

class MenuController {
  private menuService = new MenuService();

  public getAllMenus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const summaryOnly = req.query.summaryOnly === "true";

      const { menus, count } = await this.menuService.getAllMenus(
        skip,
        limit,
        summaryOnly
      );

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        data: menus,
        meta,
        message: "findAllMenus",
      });
    } catch (error) {
      next(error);
    }
  };

  public getMenuById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const menu = await this.menuService.getMenuById(id);
      res.status(200).json({ data: menu, message: "findMenu" });
    } catch (error) {
      next(error);
    }
  };

  public createMenu = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const menu = await this.menuService.createMenu(req.body);
      res.status(201).json({ data: menu, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateMenu = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const menu = await this.menuService.updateMenu(id, req.body);
      res.status(200).json({ data: menu, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public deleteMenu = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const menu = await this.menuService.deleteMenu(id);
      res.status(200).json({ data: menu, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };

  public getMenusByCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categoryId = parseInt(req.params.categoryId, 10);
      const { page, limit, skip } = getPaginationParams(req.query);

      const { menus, count } = await this.menuService.getMenusByCategory(
        categoryId,
        skip,
        limit
      );

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        data: menus,
        meta,
        message: "findMenusByCategory",
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MenuController; 