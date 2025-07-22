import { PrismaClient, Post, Prisma } from "@prisma/client";
import { isEmpty } from "../utils/util";
import { HttpException } from "../exceptions/HttpException";
import { IPost, PostStatusEnum } from "../interfaces/post.interface";

class PostService {
  private prisma: PrismaClient;

  // Safe author selection - excludes sensitive data like passwords, emails, tokens, etc.
  // This ensures that no sensitive user information is exposed through post-related endpoints.
  // Fields excluded: password, email, telegramId, phoneNumber, emailVerificationToken, 
  // resetPasswordToken, resetPasswordExpires, roles, permissions
  private readonly safeAuthorSelect = {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    profilePicture: true,
    verified: true,
    createdAt: true,
    updatedAt: true,
  };

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
          author: {
            select: this.safeAuthorSelect,
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        }
      : {
          id: true,
          title: true,
          content: true,
          headerImage: true,
          authorId: true,
          author: {
            select: this.safeAuthorSelect,
          },
          postLikes: true,
          comments: true,
          categories: true,
          tags: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        };

    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        where: {
          approved: true,
          status: "PUBLISHED",
        },
        skip: Number(skip),
        take: Number(limit),
        select: selectFields,
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" }, // Secondary sort by id
        ],
      }),
      this.prisma.post.count({
        where: {
          approved: true,
          status: "PUBLISHED",
        },
      }),
    ]);

    console.log("Posts: ", posts);

    return { posts, count };
  }

  /**
 * Search posts by term or hashtag with comprehensive search across multiple fields.
 * Searches in: post title, post content, author username, categories, and hashtags.
 * @param term - The search term to look for across all searchable fields (optional).
 * @param hashtag - The specific hashtag to search by (optional).
 * @param skip - Number of records to skip for pagination.
 * @param limit - Number of records to fetch.
 * @returns An object containing the list of posts and the total count.
 */
public async searchPost(
  term?: string,
  hashtag?: string,
  skip: number = 0,
  limit: number = 10
): Promise<{ posts: IPost[]; count: number }> {
  console.log("Search parameters:", { term, hashtag, skip, limit });
  
  if (isEmpty(term) && isEmpty(hashtag)) {
    throw new HttpException(400, "Search term or hashtag is required");
  }

  try {
    const decodedTerm = term ? decodeURIComponent(term).trim() : undefined;
    const decodedHashtag = hashtag ? decodeURIComponent(hashtag).trim() : undefined;

    console.log("Decoded search parameters:", { decodedTerm, decodedHashtag });

    // Define the base where clause
    const whereClause: any = {
      approved: true,
      status: "PUBLISHED",
    };

    // Add search conditions based on term or hashtag
    if (decodedTerm) {
      whereClause.OR = [
        // Search in post title
        {
          title: {
            contains: decodedTerm,
            mode: "insensitive",
          },
        },
        // Search in post content
        {
          content: {
            contains: decodedTerm,
            mode: "insensitive",
          },
        },
        // Search in author username
        {
          author: {
            username: {
              contains: decodedTerm,
              mode: "insensitive",
            },
          },
        },
        // Search in categories
        {
          categories: {
            some: {
              name: {
                contains: decodedTerm,
                mode: "insensitive",
              },
            },
          },
        },
        // Search in tags/hashtags
        {
          tags: {
            some: {
              name: {
                contains: decodedTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ];
    }

    // If specific hashtag search is requested
    if (decodedHashtag) {
      // If we already have term conditions, we need to combine them properly
      if (decodedTerm) {
        // Add hashtag condition to existing OR conditions
        whereClause.OR.push({
          tags: {
            some: {
              name: {
                contains: decodedHashtag,
                mode: "insensitive",
              },
            },
          },
        });
      } else {
        // If only hashtag search, create a simple condition
        whereClause.tags = {
          some: {
            name: {
              contains: decodedHashtag,
              mode: "insensitive",
            },
          },
        };
      }
    }

    console.log("Final where clause:", JSON.stringify(whereClause, null, 2));

    // Fetch paginated posts
    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        where: whereClause,
        skip: Number(skip),
        take: Number(limit),
        include: {
          author: {
            select: this.safeAuthorSelect,
          },
          postLikes: true,
          comments: {
            include: {
              author: {
                select: this.safeAuthorSelect,
              },
            },
          },
          categories: true,
          tags: true,
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      }),
      this.prisma.post.count({
        where: whereClause,
      }),
    ]);

    // Map posts to include userId in comments
    const mappedPosts = posts.map((post) => ({
      ...post,
      status: post.status as unknown as PostStatusEnum,
      comments: post.comments.map((comment) => ({
        ...comment,
        userId: comment.author.id,
      })),
    })) as IPost[];

    return { posts: mappedPosts, count };
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
        include: {
          author: {
            select: this.safeAuthorSelect,
          },
          postLikes: true,
          comments: {
            include: {
              author: {
                select: this.safeAuthorSelect,
              },
            },
          },
          categories: true,
          tags: true,
        },
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
        include: {
          author: {
            select: this.safeAuthorSelect,
          },
          postLikes: true,
          comments: {
            include: {
              author: {
                select: this.safeAuthorSelect,
              },
            },
          },
          categories: true,
          tags: true,
        },
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
