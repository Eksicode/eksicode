"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostController = void 0;
const tslib_1 = require("tslib");
const post_service_1 = tslib_1.__importDefault(require("../services/post.service"));
const HttpException_1 = require("../exceptions/HttpException");
class PostController {
    constructor(postService) {
        this.getAllPosts = async (req, res, next) => {
            try {
                const { skip, limit } = this.validatePaginationParams(req.query.skip, req.query.limit);
                const summaryOnly = req.query.summaryOnly === "true";
                const { posts, count } = await this.postService.getAllPosts(skip, limit, summaryOnly);
                console.log("getAllPosts request:", {
                    skip,
                    limit,
                    summaryOnly,
                    url: req.url,
                });
                res.status(200).json({
                    data: posts,
                    meta: {
                        total: count,
                        skip,
                        limit,
                        summaryOnly,
                        currentPage: Math.floor(skip / limit) + 1,
                        totalPages: Math.ceil(count / limit),
                    },
                    message: "Posts retrieved successfully",
                });
            }
            catch (error) {
                console.error('Error in getAllPosts:', error);
                if (error instanceof HttpException_1.HttpException) {
                    res.status(400).json({
                        message: error.message,
                    });
                }
                else {
                    res.status(500).json({
                        message: "Internal server error",
                        error: error instanceof Error ? error.message : String(error),
                    });
                }
                next(error);
            }
        };
        this.getPostBySlug = async (req, res, next) => {
            try {
                const post = await this.postService.getPostBySlug(req.params.slug);
                if (!post) {
                    res.status(404).json({ message: "Post not found" });
                }
                else {
                    res
                        .status(200)
                        .json({ data: post, message: "Post retrieved successfully" });
                }
            }
            catch (error) {
                res.status(500).json({
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : String(error),
                });
                next(error);
            }
        };
        this.getPostsBySearch = async (req, res, next) => {
            try {
                const term = req.params.term;
                const posts = await this.postService.searchPost(term);
                res
                    .status(200)
                    .json({ data: posts, message: "Posts retrieved successfully" });
            }
            catch (error) {
                res.status(500).json({
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : String(error),
                });
                next(error);
            }
        };
        this.createPost = async (req, res, next) => {
            try {
                const post = await this.postService.createPost(req.body);
                res
                    .status(201)
                    .json({ data: post, message: "Post created successfully" });
            }
            catch (error) {
                res.status(500).json({
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : String(error),
                });
                next(error);
            }
        };
        this.updatePost = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                const post = await this.postService.updatePost(id, req.body);
                res
                    .status(200)
                    .json({ data: post, message: "Post updated successfully" });
            }
            catch (error) {
                res.status(500).json({
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : String(error),
                });
                next(error);
            }
        };
        this.deletePost = async (req, res, next) => {
            try {
                const id = parseInt(req.params.id, 10);
                await this.postService.deletePost(id);
                res.status(200).json({ message: "Post deleted successfully" });
            }
            catch (error) {
                res.status(500).json({
                    message: "Internal server error",
                    error: error instanceof Error ? error.message : String(error),
                });
                next(error);
            }
        };
        this.postService = postService || new post_service_1.default();
    }
    validatePaginationParams(skip, limit) {
        const parsedSkip = Number(skip);
        const parsedLimit = Number(limit);
        if (isNaN(parsedSkip) || parsedSkip < 0) {
            throw new HttpException_1.HttpException(400, "Invalid skip parameter");
        }
        if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
            throw new HttpException_1.HttpException(400, "Invalid limit parameter (1-100)");
        }
        return {
            skip: parsedSkip,
            limit: parsedLimit,
        };
    }
}
exports.PostController = PostController;
//# sourceMappingURL=post.controller.js.map