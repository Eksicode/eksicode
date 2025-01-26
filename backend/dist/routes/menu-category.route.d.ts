import MenuCategoryController from "../controllers/menu-category.controller";
import { Routes } from "../interfaces/routes.interface";
declare class MenuCategoryRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    menuCategoryController: MenuCategoryController;
    constructor();
    private initializeRoutes;
}
export default MenuCategoryRoute;
