import { Router } from "express";
import { PostController } from "../controllers/post.controller";
import { Routes } from "../interfaces/routes.interface";

class PostRoute implements Routes {
  public path = "/posts";
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.postController.getAllPosts); // GET /Posts
    // this.router.get(`${this.path}/:id`, this.pageController.getPageById); // GET /Posts/:id
    this.router.get(`${this.path}/:slug`, this.postController.getPostBySlug); // GET /Posts/:slug
    this.router.get(`${this.path}/search`, this.postController.getPostsBySearch); // GET /Posts/:slug
    this.router.post(`${this.path}`, this.postController.createPost); // POST /Posts
    this.router.put(`${this.path}/:id`, this.postController.updatePost); // PUT /Posts/:id
    this.router.delete(`${this.path}/:id`, this.postController.deletePost); // DELETE /Posts/:id
  }
}

export default PostRoute;
