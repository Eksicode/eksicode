"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const page_controller_1 = tslib_1.__importDefault(require("../controllers/page.controller"));
class UserRoute {
    constructor() {
        this.path = "/pages";
        this.router = (0, express_1.Router)();
        this.pageController = new page_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.pageController.getAllPages); // GET /pages
        // this.router.get(`${this.path}/:id`, this.pageController.getPageById); // GET /pages/:id
        this.router.get(`${this.path}/:slug`, this.pageController.getPageBySlug); // GET /pages/:slug
        this.router.post(`${this.path}`, this.pageController.createPage); // POST /pages
        this.router.put(`${this.path}/:id`, this.pageController.updatePage); // PUT /pages/:id
        this.router.delete(`${this.path}/:id`, this.pageController.deletePage); // DELETE /pages/:id
    }
}
exports.default = UserRoute;
//# sourceMappingURL=page.route.js.map