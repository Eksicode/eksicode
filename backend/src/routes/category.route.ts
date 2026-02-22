import { Router } from "express";
import CategoryController from "../controllers/category.controller";
import { Routes } from "../interfaces/routes.interface";

class CategoryRoute implements Routes {
    public path = "/categories";
    public router = Router();
    public categoryController = new CategoryController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.categoryController.getAllCategories);
    }
}

export default CategoryRoute;
