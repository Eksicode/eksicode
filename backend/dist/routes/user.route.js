"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const user_controller_1 = tslib_1.__importDefault(require("../controllers/user.controller"));
class UserRoute {
    constructor() {
        this.path = "/users";
        this.router = (0, express_1.Router)();
        this.userController = new user_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.userController.getAllUsers); // GET /users
        this.router.get(`${this.path}/:id`, this.userController.getUserById); // GET /users/:id
        this.router.post(`${this.path}`, this.userController.createUser); // POST /users
        this.router.put(`${this.path}/:id`, this.userController.updateUser); // PUT /users/:id
        this.router.delete(`${this.path}/:id`, this.userController.deleteUser); // DELETE /users/:id
    }
}
exports.default = UserRoute;
//# sourceMappingURL=user.route.js.map