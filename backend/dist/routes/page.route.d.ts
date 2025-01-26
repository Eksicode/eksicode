import PageController from "../controllers/page.controller";
import { Routes } from "../interfaces/routes.interface";
declare class UserRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    pageController: PageController;
    constructor();
    private initializeRoutes;
}
export default UserRoute;
