import { Request, Response, NextFunction } from "express";
declare class MenuCategoryController {
    private menuCategoryService;
    getAllMenuCategories: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMenuCategoryById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createMenuCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMenuCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteMenuCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default MenuCategoryController;
