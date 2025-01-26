"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const menu_category_service_1 = tslib_1.__importDefault(require("../services/menu-category.service"));
const pagination_1 = require("../utils/pagination");
class MenuCategoryController {
    constructor() {
        this.menuCategoryService = new menu_category_service_1.default();
        this.getAllMenuCategories = async (req, res, next) => {
            try {
                const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
                const { categories, count } = await this.menuCategoryService.getAllMenuCategories(skip, limit);
                const meta = (0, pagination_1.getPaginationMeta)(count, page, limit);
                res.status(200).json({
                    data: categories,
                    meta,
                    message: "findAllMenuCategories",
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getMenuCategoryById = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                const category = await this.menuCategoryService.getMenuCategoryById(id);
                res.status(200).json({ data: category, message: "findMenuCategory" });
            }
            catch (error) {
                next(error);
            }
        };
        this.createMenuCategory = async (req, res, next) => {
            try {
                const category = await this.menuCategoryService.createMenuCategory(req.body);
                res.status(201).json({ data: category, message: "created" });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateMenuCategory = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                const category = await this.menuCategoryService.updateMenuCategory(id, req.body);
                res.status(200).json({ data: category, message: "updated" });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteMenuCategory = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                const category = await this.menuCategoryService.deleteMenuCategory(id);
                res.status(200).json({ data: category, message: "deleted" });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = MenuCategoryController;
//# sourceMappingURL=menu-category.controller.js.map