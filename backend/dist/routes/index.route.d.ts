import IndexController from '../controllers/index.controller';
import { Routes } from '../interfaces/routes.interface';
declare class IndexRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    indexController: IndexController;
    constructor();
    private initializeRoutes;
}
export default IndexRoute;
