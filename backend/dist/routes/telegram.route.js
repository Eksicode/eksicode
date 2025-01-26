"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const telegram_controller_1 = tslib_1.__importDefault(require("../controllers/telegram.controller"));
class UserRoute {
    constructor() {
        this.path = "/telegrams";
        this.router = (0, express_1.Router)();
        this.telegramGroupsController = new telegram_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.telegramGroupsController.getAllTelegramGroups); // GET /telegrams
        this.router.get(`${this.path}/:id`, this.telegramGroupsController.getTelegramGroupById); // GET /telegrams/:id
        this.router.post(`${this.path}`, this.telegramGroupsController.createTelegramGroup); // POST /telegrams
        this.router.put(`${this.path}/:id`, this.telegramGroupsController.updateTelegramGroup); // PUT /telegrams/:id
        this.router.delete(`${this.path}/:id`, this.telegramGroupsController.deleteTelegramGroup); // DELETE /telegrams/:id
    }
}
exports.default = UserRoute;
//# sourceMappingURL=telegram.route.js.map