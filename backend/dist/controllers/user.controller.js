"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_service_1 = tslib_1.__importDefault(require("../services/user.service"));
const pagination_1 = require("../utils/pagination");
class UserController {
    constructor() {
        this.userService = new user_service_1.default();
        this.getAllUsers = async (req, res, next) => {
            try {
                const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
                const summaryOnly = req.query.summaryOnly === "true";
                const { users, count } = await this.userService.getAllUsers(skip, limit, summaryOnly);
                const meta = (0, pagination_1.getPaginationMeta)(count, page, limit);
                res.status(200).json({
                    data: users,
                    meta,
                    message: "findAllUsers",
                });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.getUserById = async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const user = await this.userService.getUserById(id);
                if (!user) {
                    res.status(404).json({ message: "User not found" });
                }
                else {
                    res.status(200).json(user);
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.createUser = async (req, res) => {
            try {
                const user = await this.userService.createUser(req.body);
                res.status(201).json(user);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.updateUser = async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const user = await this.userService.updateUser(id, req.body);
                res.status(200).json(user);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
        this.deleteUser = async (req, res) => {
            try {
                const id = parseInt(req.params.id, 10);
                const user = await this.userService.deleteUser(id);
                res.status(200).json({ message: "User deleted successfully", user });
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        };
    }
}
exports.default = UserController;
//# sourceMappingURL=user.controller.js.map