import { Request, Response, NextFunction } from "express";
import CategoryService from "../services/category.service";
import { HttpException } from "../exceptions/HttpException";

class CategoryController {
    private categoryService = new CategoryService();

    public getAllCategories = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json({
                data: categories,
                message: "Categories retrieved successfully",
                success: true
            });
        } catch (error) {
            if (res.headersSent) {
                return next(error);
            }

            if (error instanceof HttpException) {
                res.status(error.status).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : String(error),
                });
            }
        }
    };
}

export default CategoryController;
