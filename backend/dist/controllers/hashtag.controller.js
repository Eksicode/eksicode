"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const hashtag_service_1 = tslib_1.__importDefault(require("../services/hashtag.service"));
const pagination_1 = require("../utils/pagination");
class HashtagController {
    constructor() {
        this.hashtagService = new hashtag_service_1.default();
        this.getAllHashtags = async (req, res, next) => {
            try {
                const { page, limit, skip } = (0, pagination_1.getPaginationParams)(req.query);
                const { hashTags, count } = await this.hashtagService.getAllHashtags(skip, limit);
                const meta = (0, pagination_1.getPaginationMeta)(count, page, limit);
                res.status(200).json({
                    data: hashTags,
                    meta,
                    message: "findAllHashtags",
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.getHashtagById = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                const hashtag = await this.hashtagService.getHashtagById(id);
                res.status(200).json({ data: hashtag, message: "findHashtag" });
            }
            catch (error) {
                next(error);
            }
        };
        this.createHashtag = async (req, res, next) => {
            try {
                const hashtag = await this.hashtagService.createHashtag(req.body);
                res.status(201).json({ data: hashtag, message: "created" });
            }
            catch (error) {
                next(error);
            }
        };
        this.updateHashtag = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                const hashtag = await this.hashtagService.updateHashtag(id, req.body);
                res.status(200).json({ data: hashtag, message: "updated" });
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteHashtag = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                await this.hashtagService.deleteHashtag(id);
                res.status(200).json({ message: "deleted" });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = HashtagController;
//# sourceMappingURL=hashtag.controller.js.map