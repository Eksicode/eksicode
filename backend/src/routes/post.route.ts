import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import { uploadSingle, handleUploadError } from "../middlewares/upload.middleware";

class PostRoute implements Routes {
  public path = "/posts";
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.get(`${this.path}`, this.postController.getAllPosts); // GET /posts
    this.router.get(`${this.path}/search`, this.postController.getPostsBySearch); // GET /posts/search
    this.router.get(`${this.path}/:slug`, this.postController.getPostBySlug); // GET /posts/:slug
    this.router.get(`${this.path}/stats/overview`, this.postController.getPostStats); // GET /posts/stats/overview
    
    // Protected routes (require authentication)
    this.router.post(`${this.path}`, authMiddleware, this.postController.createPost); // POST /posts
    this.router.put(`${this.path}/:id`, authMiddleware, this.postController.updatePost); // PUT /posts/:id
    this.router.delete(`${this.path}/:id`, authMiddleware, this.postController.deletePost); // DELETE /posts/:id
    
    // Header image upload routes (require authentication)
    this.router.post(
      `${this.path}/:id/header-image`,
      authMiddleware,
      uploadSingle('headerImage'),
      handleUploadError,
      this.postController.uploadPostHeaderImage
    ); // POST /posts/:id/header-image
    
    this.router.delete(
      `${this.path}/:id/header-image`,
      authMiddleware,
      this.postController.removePostHeaderImage
    ); // DELETE /posts/:id/header-image
  }
}

export default PostRoute;
