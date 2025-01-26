import MenuController from "../controllers/menu.controller";
import { Routes } from "../interfaces/routes.interface";
declare class MenuRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    menuController: MenuController;
    constructor();
    private initializeRoutes;
}
export default MenuRoute;
