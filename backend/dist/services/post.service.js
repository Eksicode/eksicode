"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const util_1 = require("../utils/util");
const HttpException_1 = require("../exceptions/HttpException");
class PostService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    /**
     * Fetch all posts with pagination and optional summary view.
     * @param skip - Number of records to skip for pagination.
     * @param limit - Number of records to fetch.
     * @param summaryOnly - Whether to return a summarized view or detailed view.
     * @returns An object containing the list of posts and the total count.
     */
    async getAllPosts(skip, limit, summaryOnly) {
        console.log('Service getAllPosts params:', { skip, limit, summaryOnly });
        const selectFields = summaryOnly
            ? {
                id: true,
                title: true,
                slug: true,
                createdAt: true,
            }
            : {
                id: true,
                title: true,
                content: true,
                headerImage: true,
                authorId: true,
                author: true,
                postLikes: true,
                comments: true,
                categories: true,
                tags: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
            };
        console.log("skip: ", skip);
        console.log(typeof skip);
        console.log('Query params:', {
            limit,
            skip,
            summaryOnly,
            calculatedPage: Math.floor(skip / limit) + 1
        });
        const [posts, count] = await Promise.all([
            this.prisma.post.findMany({
                where: {
                    approved: true,
                    status: 'published'
                },
                skip: Number(skip),
                take: Number(limit),
                select: selectFields,
                orderBy: [
                    { createdAt: 'desc' }, // Primary sort by creation date
                    { id: 'desc' }, // Secondary sort by id
                ],
            }),
            this.prisma.post.count({
                where: {
                    approved: true,
                    status: 'published'
                }
            }),
        ]);
        console.log("Posts: ", posts);
        return { posts, count };
    }
    // Search post by term
    async searchPost(term) {
        if ((0, util_1.isEmpty)(term))
            throw new HttpException_1.HttpException(400, "Search term is empty");
        const decodedTerm = decodeURIComponent(term);
        console.log("Search term after decoding:", decodedTerm);
        try {
            const decodedTerm = decodeURIComponent(term);
            console.log("Search term after decoding:", decodedTerm);
            let posts = await this.prisma.post.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: decodedTerm,
                                mode: "insensitive",
                            },
                        },
                        {
                            content: {
                                contains: decodedTerm,
                                mode: "insensitive",
                            },
                        },
                    ],
                },
                include: {
                    author: true,
                    postLikes: true,
                    comments: {
                        include: {
                            author: true, // Include author to get userId
                        },
                    },
                    categories: true,
                    tags: true,
                },
            });
            if (posts.length <= 1) {
                posts = [];
            }
            // Transform Prisma types to match IPost interface
            return posts.map((post) => (Object.assign(Object.assign({}, post), { comments: post.comments.map((comment) => (Object.assign(Object.assign({}, comment), { userId: comment.author.id }))) })));
        }
        catch (error) {
            console.error("Error searching posts:", error);
            throw new HttpException_1.HttpException(500, "Error searching posts");
        }
    }
    /**
     * Fetch a specific post by its ID.
     * @param id - The ID of the post.
     * @returns The post if found, or null if not.
     */
    async getPostById(id) {
        try {
            return await this.prisma.post.findUnique({
                where: { id },
            });
        }
        catch (error) {
            console.error(`Error fetching post with ID ${id}:`, error);
            throw new Error("Unable to fetch post.");
        }
    }
    /**
     * Fetch a specific post by its slug.
     * @param slug - The slug of the post.
     * @returns The post if found, or null if not.
     */
    async getPostBySlug(slug) {
        try {
            return await this.prisma.post.findUnique({
                where: { slug },
            });
        }
        catch (error) {
            console.error(`Error fetching post with ID ${slug}:`, error);
            throw new Error("Unable to fetch post.");
        }
    }
    /**
     * Create a new post.
     * @param data - The data for the new post.
     * @returns The created post.
     */
    async createPost(data) {
        try {
            return await this.prisma.post.create({ data });
        }
        catch (error) {
            console.error("Error creating post:", error);
            throw new Error("Unable to create post.");
        }
    }
    /**
     * Update an existing post by its ID.
     * @param id - The ID of the post to update.
     * @param data - The updated data for the post.
     * @returns The updated post.
     */
    async updatePost(id, data) {
        try {
            return await this.prisma.post.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            console.error(`Error updating post with ID ${id}:`, error);
            throw new Error("Unable to update post.");
        }
    }
    /**
     * Delete a post by its ID.
     * @param id - The ID of the post to delete.
     * @returns The deleted post.
     */
    async deletePost(id) {
        try {
            return await this.prisma.post.delete({
                where: { id },
            });
        }
        catch (error) {
            console.error(`Error deleting post with ID ${id}:`, error);
            throw new Error("Unable to delete post.");
        }
    }
}
exports.default = PostService;
//# sourceMappingURL=post.service.js.map