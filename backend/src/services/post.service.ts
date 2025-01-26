import { PrismaClient, Post, Prisma } from "@prisma/client";
import { isEmpty } from "../utils/util";
import { HttpException } from "../exceptions/HttpException";
import { IPost } from "../interfaces/post.interface";

class PostService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Fetch all posts with pagination and optional summary view.
   * @param skip - Number of records to skip for pagination.
   * @param limit - Number of records to fetch.
   * @param summaryOnly - Whether to return a summarized view or detailed view.
   * @returns An object containing the list of posts and the total count.
   */
  public async getAllPosts(
    skip: number,
    limit: number,
    summaryOnly: boolean
  ): Promise<{ posts: Partial<Post>[]; count: number }> {
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

    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: limit,
        select: selectFields,
        where: {
          approved: true,
          status: 'published'
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      this.prisma.post.count({
        where: {
          approved: true,
          status: 'published'
        }
      }),
    ]);

    return { posts, count };
  }
  
  // Search post by term
  public async searchPost(term: string): Promise<IPost[]> {
    if (isEmpty(term)) throw new HttpException(400, "Search term is empty");
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
      return posts.map((post) => ({
        ...post,
        comments: post.comments.map((comment) => ({
          ...comment,
          userId: comment.author.id, // Map authorId to userId
        })),
      })) as IPost[];
    } catch (error) {
      console.error("Error searching posts:", error);
      throw new HttpException(500, "Error searching posts");
    }
  }

  /**
   * Fetch a specific post by its ID.
   * @param id - The ID of the post.
   * @returns The post if found, or null if not.
   */
  public async getPostById(id: number): Promise<Post | null> {
    try {
      return await this.prisma.post.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      throw new Error("Unable to fetch post.");
    }
  }

  /**
   * Fetch a specific post by its slug.
   * @param slug - The slug of the post.
   * @returns The post if found, or null if not.
   */
  public async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      return await this.prisma.post.findUnique({
        where: { slug },
      });
    } catch (error) {
      console.error(`Error fetching post with ID ${slug}:`, error);
      throw new Error("Unable to fetch post.");
    }
  }

  /**
   * Create a new post.
   * @param data - The data for the new post.
   * @returns The created post.
   */
  public async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    try {
      return await this.prisma.post.create({ data });
    } catch (error) {
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
  public async updatePost(
    id: number,
    data: Partial<Prisma.PostUpdateInput>
  ): Promise<Post> {
    try {
      return await this.prisma.post.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
      throw new Error("Unable to update post.");
    }
  }

  /**
   * Delete a post by its ID.
   * @param id - The ID of the post to delete.
   * @returns The deleted post.
   */
  public async deletePost(id: number): Promise<Post> {
    try {
      return await this.prisma.post.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
      throw new Error("Unable to delete post.");
    }
  }
}

export default PostService;
