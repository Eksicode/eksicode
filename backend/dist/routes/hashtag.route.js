"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = require("express");
const hashtag_controller_1 = tslib_1.__importDefault(require("../controllers/hashtag.controller"));
class HashtagRoute {
    constructor() {
        this.path = "/hashtags";
        this.router = (0, express_1.Router)();
        this.hashtagController = new hashtag_controller_1.default();
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.hashtagController.getAllHashtags);
        this.router.get(`${this.path}/:id`, this.hashtagController.getHashtagById);
        this.router.post(`${this.path}`, this.hashtagController.createHashtag);
        this.router.put(`${this.path}/:id`, this.hashtagController.updateHashtag);
        this.router.delete(`${this.path}/:id`, this.hashtagController.deleteHashtag);
    }
}
exports.default = HashtagRoute;
//# sourceMappingURL=hashtag.route.js.map