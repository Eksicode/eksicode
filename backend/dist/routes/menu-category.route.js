"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const menu_category_controller_1 = tslib_1.__importDefault(require("../controllers/menu-category.controller"));
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
class MenuCategoryRoute {
    constructor() {
        this.path = "/menu-categories";
        this.router = (0, express_1.Router)();
        this.menuCategoryController = new menu_category_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.menuCategoryController.getAllMenuCategories);
        this.router.get(`${this.path}/:id`, this.menuCategoryController.getMenuCategoryById);
        // Protected routes
        this.router.post(`${this.path}`, auth_middleware_1.default, this.menuCategoryController.createMenuCategory);
        this.router.put(`${this.path}/:id`, auth_middleware_1.default, this.menuCategoryController.updateMenuCategory);
        this.router.delete(`${this.path}/:id`, auth_middleware_1.default, this.menuCategoryController.deleteMenuCategory);
    }
}
exports.default = MenuCategoryRoute;
//# sourceMappingURL=menu-category.route.js.map