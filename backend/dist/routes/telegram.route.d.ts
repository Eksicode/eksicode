import TelegramGroupsController from "../controllers/telegram.controller";
import { Routes } from "../interfaces/routes.interface";
declare class UserRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    telegramGroupsController: TelegramGroupsController;
    constructor();
    private initializeRoutes;
}
export default UserRoute;
