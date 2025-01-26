"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const menu_controller_1 = tslib_1.__importDefault(require("../controllers/menu.controller"));
const auth_middleware_1 = tslib_1.__importDefault(require("../middlewares/auth.middleware"));
class MenuRoute {
    constructor() {
        this.path = "/menus";
        this.router = (0, express_1.Router)();
        this.menuController = new menu_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.menuController.getAllMenus);
        this.router.get(`${this.path}/:id`, this.menuController.getMenuById);
        // Protected routes requiring authentication
        this.router.post(`${this.path}`, auth_middleware_1.default, this.menuController.createMenu);
        this.router.put(`${this.path}/:id`, auth_middleware_1.default, this.menuController.updateMenu);
        this.router.delete(`${this.path}/:id`, auth_middleware_1.default, this.menuController.deleteMenu);
        // Add new route for getting menus by category
        this.router.get(`${this.path}/category/:categoryId`, this.menuController.getMenusByCategory);
    }
}
exports.default = MenuRoute;
//# sourceMappingURL=menu.route.js.map