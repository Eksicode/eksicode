import { Router } from "express";
import PostController from "../controllers/post.controller";
import { Routes } from "../interfaces/routes.interface";

class PostRoute implements Routes {
  public path = "/posts";
  public router = Router();
  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.postController.getAllPosts); // GET /pages
    // this.router.get(`${this.path}/:id`, this.pageController.getPageById); // GET /pages/:id
    this.router.get(`${this.path}/:slug`, this.postController.getPostBySlug); // GET /pages/:slug
    this.router.post(`${this.path}`, this.postController.createPost); // POST /pages
    this.router.put(`${this.path}/:id`, this.postController.updatePost); // PUT /pages/:id
    this.router.delete(`${this.path}/:id`, this.postController.deletePost); // DELETE /pages/:id
  }
}

export default PostRoute;
