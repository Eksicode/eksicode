import { PostController } from "../controllers/post.controller";
import { Routes } from "../interfaces/routes.interface";
declare class PostRoute implements Routes {
    path: string;
    router: import("express-serve-static-core").Router;
    postController: PostController;
    constructor();
    private initializeRoutes;
}
export default PostRoute;
