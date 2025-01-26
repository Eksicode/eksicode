import { Request, Response, NextFunction } from "express";
declare class MenuController {
    private menuService;
    getAllMenus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMenuById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createMenu: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateMenu: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteMenu: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getMenusByCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default MenuController;
