"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_controller_1 = require("../controllers/post.controller");
class PostRoute {
    constructor() {
        this.path = "/posts";
        this.router = (0, express_1.Router)();
        this.postController = new post_controller_1.PostController();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.postController.getAllPosts); // GET /pages
        // this.router.get(`${this.path}/:id`, this.pageController.getPageById); // GET /pages/:id
        this.router.get(`${this.path}/:slug`, this.postController.getPostBySlug); // GET /pages/:slug
        this.router.get(`${this.path}/search/:term`, this.postController.getPostsBySearch); // GET /pages/:slug
        this.router.post(`${this.path}`, this.postController.createPost); // POST /pages
        this.router.put(`${this.path}/:id`, this.postController.updatePost); // PUT /pages/:id
        this.router.delete(`${this.path}/:id`, this.postController.deletePost); // DELETE /pages/:id
    }
}
exports.default = PostRoute;
//# sourceMappingURL=post.route.js.map