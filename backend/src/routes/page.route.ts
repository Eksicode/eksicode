import { Router } from "express";
import PageController from "../controllers/page.controller";
import { Routes } from "../interfaces/routes.interface";

class UserRoute implements Routes {
  public path = "/pages";
  public router = Router();
  public pageController = new PageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.pageController.getAllPages); // GET /pages
    // this.router.get(`${this.path}/:id`, this.pageController.getPageById); // GET /pages/:id
    this.router.get(`${this.path}/:slug`, this.pageController.getPageBySlug); // GET /pages/:slug
    this.router.post(`${this.path}`, this.pageController.createPage); // POST /pages
    this.router.put(`${this.path}/:id`, this.pageController.updatePage); // PUT /pages/:id
    this.router.delete(`${this.path}/:id`, this.pageController.deletePage); // DELETE /pages/:id
  }
}

export default UserRoute;
