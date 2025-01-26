import HashtagController from "../controllers/hashtag.controller";
import { Routes } from "../interfaces/routes.interface";
declare class HashtagRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    hashtagController: HashtagController;
    constructor();
    private initializeRoutes;
}
export default HashtagRoute;
