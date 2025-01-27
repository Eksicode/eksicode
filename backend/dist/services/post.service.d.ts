import { Post, Prisma } from "@prisma/client";
import { IPost } from "../interfaces/post.interface";
declare class PostService {
    private prisma;
    constructor();
    /**
     * Fetch all posts with pagination and optional summary view.
     * @param skip - Number of records to skip for pagination.
     * @param limit - Number of records to fetch.
     * @param summaryOnly - Whether to return a summarized view or detailed view.
     * @returns An object containing the list of posts and the total count.
     */
    getAllPosts(skip: number, limit: number, summaryOnly: boolean): Promise<{
        posts: Partial<Post>[];
        count: number;
    }>;
    /**
     * Search posts by term with pagination.
     * @param term - The search term.
     * @param skip - Number of records to skip for pagination.
     * @param limit - Number of records to fetch.
     * @returns An object containing the list of posts and the total count.
     */
    searchPost(term: string, skip: number, limit: number): Promise<{
        posts: IPost[];
        count: number;
    }>;
    /**
     * Fetch a specific post by its ID.
     * @param id - The ID of the post.
     * @returns The post if found, or null if not.
     */
    getPostById(id: number): Promise<Post | null>;
    /**
     * Fetch a specific post by its slug.
     * @param slug - The slug of the post.
     * @returns The post if found, or null if not.
     */
    getPostBySlug(slug: string): Promise<Post | null>;
    /**
     * Create a new post.
     * @param data - The data for the new post.
     * @returns The created post.
     */
    createPost(data: Prisma.PostCreateInput): Promise<Post>;
    /**
     * Update an existing post by its ID.
     * @param id - The ID of the post to update.
     * @param data - The updated data for the post.
     * @returns The updated post.
     */
    updatePost(id: number, data: Partial<Prisma.PostUpdateInput>): Promise<Post>;
    /**
     * Delete a post by its ID.
     * @param id - The ID of the post to delete.
     * @returns The deleted post.
     */
    deletePost(id: number): Promise<Post>;
}
export default PostService;
