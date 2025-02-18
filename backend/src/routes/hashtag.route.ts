import { Router } from "express";
import HashtagController from "../controllers/hashtag.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";

class HashtagRoute implements Routes {
    public path = "/hashtags";
    public router = Router();
    public hashtagController = new HashtagController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.hashtagController.getAllHashtags);
        this.router.get(`${this.path}/:id`, this.hashtagController.getHashtagById);
        this.router.post(`${this.path}`, authMiddleware, this.hashtagController.createHashtag);
        this.router.put(`${this.path}/:id`, authMiddleware, this.hashtagController.updateHashtag);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.hashtagController.deleteHashtag);
    }
}

export default HashtagRoute;