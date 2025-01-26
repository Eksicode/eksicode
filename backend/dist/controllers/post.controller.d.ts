import { Request, Response, NextFunction } from "express";
import PostService from "../services/post.service";
export declare class PostController {
    private postService;
    constructor(postService?: PostService);
    private validatePaginationParams;
    getAllPosts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPostBySlug: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPostsBySearch: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updatePost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deletePost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
