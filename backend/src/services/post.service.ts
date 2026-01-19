import { PrismaClient, Post, Prisma, PostStatus } from "@prisma/client";
import { isEmpty } from "../utils/util";
import { HttpException } from "../exceptions/HttpException";
import { 
  IPost, 
  PostStatusEnum, 
  CreatePostDTO, 
  UpdatePostDTO, 
  PostSearchParams, 
  PostListParams,
  PostListResponse,
  PostSearchResponse,
  PostResponse,
  PostStats,
  Media,
  User,
  Comment,
  PostCategory,
  Tag
} from "../interfaces/post.interface";
import MediaService, { MediaUpload } from './media.service';
import { prisma } from "../config/database";

class PostService {
  private prisma: PrismaClient;
  private mediaService: MediaService;

  // Safe author selection - excludes sensitive data like passwords, emails, tokens, etc.
  // This ensures that no sensitive user information is exposed through post-related endpoints.
  // Fields excluded: password, email, telegramId, phoneNumber, emailVerificationToken, 
  // resetPasswordToken, resetPasswordExpires, roles, permissions
  private readonly safeAuthorSelect = {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    profilePicture: {
      select: {
        id: true,
        url: true,
        altText: true,
        type: true,
      }
    },
    verified: true,
    createdAt: true,
    updatedAt: true,
  };

  constructor(prismaInstance?: PrismaClient, mediaService?: MediaService) {
    this.prisma = prismaInstance || prisma;
    this.mediaService = mediaService || new MediaService(this.prisma);
  }

  /**
   * Generate a unique slug from title
   */
  private async generateSlug(title: string, existingId?: number): Promise<string> {
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingPost = await this.prisma.post.findUnique({
        where: { slug },
        select: { id: true }
      });

      if (!existingPost || existingPost.id === existingId) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Increment post view count
   */
  public async incrementViewCount(postId: number): Promise<void> {
    try {
      await this.prisma.post.update({
        where: { id: postId },
        data: {
          viewCount: {
            increment: 1
          }
        }
      });
    } catch (error) {
      console.error(`Error incrementing view count for post ${postId}:`, error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Fetch all posts with pagination and optional summary view.
   * @param params - Parameters for fetching posts
   * @returns An object containing the list of posts and the total count.
   */
  public async getAllPosts(params: PostListParams): Promise<PostListResponse> {
    const {
      skip = 0,
      limit = 10,
      summaryOnly = false,
      status,
      approved,
      authorId,
      categoryId,
      tagId
    } = params;

    // Build where clause - only add filters if explicitly provided
    const whereClause: Prisma.PostWhereInput = {};

    // Only filter by approved status if explicitly provided
    if (approved !== undefined) {
      whereClause.approved = approved;
    }

    // Only filter by status if explicitly provided
    if (status !== undefined) {
      whereClause.status = status as PostStatus;
    }

    if (authorId) {
      whereClause.authorId = authorId;
    }

    if (categoryId) {
      whereClause.categories = {
        some: { id: categoryId }
      };
    }

    if (tagId) {
      whereClause.tags = {
        some: { id: tagId }
      };
    }

    const selectFields = summaryOnly
      ? {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          publishedAt: true,
          viewCount: true,
          author: {
            select: this.safeAuthorSelect,
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        }
      : {
          id: true,
          title: true,
          content: true,
          headerImageId: true,
          headerImage: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          authorId: true,
          author: {
            select: this.safeAuthorSelect,
          },
          postLikes: {
            select: {
              id: true,
              userId: true,
              createdAt: true,
            }
          },
          comments: {
            select: {
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              author: {
                select: this.safeAuthorSelect,
              },
            },
            orderBy: { createdAt: 'desc' as const },
            take: 10, // Limit comments for performance
          },
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          status: true,
          slug: true,
          approved: true,
          publishedAt: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
        };

    const [posts, count] = await Promise.all([
      this.prisma.post.findMany({
        where: whereClause,
        skip: Number(skip),
        take: Number(limit),
        select: selectFields,
        orderBy: [
          { publishedAt: "desc" },
          { createdAt: "desc" },
          { id: "desc" },
        ],
      }),
      this.prisma.post.count({
        where: whereClause,
      }),
    ]);

    const currentPage = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(count / limit);

    return {
      data: posts as IPost[],
      meta: {
        total: count,
        skip,
        limit,
        currentPage,
        totalPages,
        summaryOnly,
      },
      message: "Posts retrieved successfully",
    };
  }

  /**
   * Search posts by term or hashtag with comprehensive search across multiple fields.
   * Searches in: post title, post content, author username, categories, and hashtags.
   * @param params - Search parameters
   * @returns An object containing the list of posts and the total count.
   */
  public async searchPosts(params: PostSearchParams): Promise<PostSearchResponse> {
    const {
      term,
      hashtag,
      category,
      author,
      status = PostStatusEnum.PUBLISHED,
      approved = true,
      skip = 0,
      limit = 10
    } = params;

    if (isEmpty(term) && isEmpty(hashtag) && isEmpty(category) && isEmpty(author)) {
      throw new HttpException(400, "At least one search parameter is required");
    }

    try {
      const decodedTerm = term ? decodeURIComponent(term).trim() : undefined;
      const decodedHashtag = hashtag ? decodeURIComponent(hashtag).trim() : undefined;
      const decodedCategory = category ? decodeURIComponent(category).trim() : undefined;
      const decodedAuthor = author ? decodeURIComponent(author).trim() : undefined;

      // Define the base where clause
      const whereClause: Prisma.PostWhereInput = {
        approved,
        status: status as PostStatus,
      };

      // Build OR conditions for search
      const orConditions: Prisma.PostWhereInput[] = [];

      if (decodedTerm) {
        orConditions.push(
          // Search in post title
          { title: { contains: decodedTerm, mode: "insensitive" } },
          // Search in post content
          { content: { contains: decodedTerm, mode: "insensitive" } },
          // Search in author username
          { author: { username: { contains: decodedTerm, mode: "insensitive" } } },
          // Search in categories
          { categories: { some: { name: { contains: decodedTerm, mode: "insensitive" } } } },
          // Search in tags/hashtags
          { tags: { some: { name: { contains: decodedTerm, mode: "insensitive" } } } }
        );
      }

      if (decodedHashtag) {
        orConditions.push({
          tags: { some: { name: { contains: decodedHashtag, mode: "insensitive" } } }
        });
      }

      if (decodedCategory) {
        orConditions.push({
          categories: { some: { name: { contains: decodedCategory, mode: "insensitive" } } }
        });
      }

      if (decodedAuthor) {
        orConditions.push({
          author: { username: { contains: decodedAuthor, mode: "insensitive" } }
        });
      }

      if (orConditions.length > 0) {
        whereClause.OR = orConditions;
      }

      // Fetch paginated posts
      const [posts, count] = await Promise.all([
        this.prisma.post.findMany({
          where: whereClause,
          skip: Number(skip),
          take: Number(limit),
          include: {
            headerImage: {
              select: {
                id: true,
                url: true,
                altText: true,
                type: true,
              }
            },
            author: {
              select: this.safeAuthorSelect,
            },
            postLikes: {
              select: {
                id: true,
                userId: true,
                createdAt: true,
              }
            },
            comments: {
              include: {
                author: {
                  select: this.safeAuthorSelect,
                },
              },
              orderBy: { createdAt: 'desc' },
              take: 10, // Limit comments for performance
            },
            categories: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            tags: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }, { id: "desc" }],
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
      })) as unknown as IPost[];

      return {
        data: mappedPosts,
        count,
        message: 'Posts retrieved successfully'
      };
    } catch (error) {
      console.error("Error searching posts:", error);
      throw new HttpException(500, "Error searching posts");
    }
  }

  /**
   * Fetch a specific post by its ID.
   * @param id - The ID of the post.
   * @param incrementView - Whether to increment the view count
   * @returns The post if found, or null if not.
   */
  public async getPostById(id: number, incrementView: boolean = false): Promise<Post | null> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id },
        include: {
          headerImage: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          author: {
            select: this.safeAuthorSelect,
          },
          postLikes: {
            select: {
              id: true,
              userId: true,
              createdAt: true,
            }
          },
          comments: {
            include: {
              author: {
                select: this.safeAuthorSelect,
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      if (post && incrementView) {
        // Increment view count asynchronously
        this.incrementViewCount(id).catch(console.error);
      }

      return post;
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      throw new HttpException(500, "Unable to fetch post.");
    }
  }

  /**
   * Fetch a specific post by its slug.
   * @param slug - The slug of the post.
   * @param incrementView - Whether to increment the view count
   * @returns The post if found, or null if not.
   */
  public async getPostBySlug(slug: string, incrementView: boolean = false): Promise<Post | null> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { slug },
        include: {
          headerImage: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          author: {
            select: this.safeAuthorSelect,
          },
          postLikes: {
            select: {
              id: true,
              userId: true,
              createdAt: true,
            }
          },
          comments: {
            include: {
              author: {
                select: this.safeAuthorSelect,
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          categories: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      if (post && incrementView) {
        // Increment view count asynchronously
        this.incrementViewCount(post.id).catch(console.error);
      }

      return post;
    } catch (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      throw new HttpException(500, "Unable to fetch post.");
    }
  }

  /**
   * Update post header image
   */
  public async updatePostHeaderImage(postId: number, file: MediaUpload, authorId: number): Promise<Post> {
    try {
      // Verify post exists and belongs to the author
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true, headerImageId: true }
      });

      if (!post) {
        throw new HttpException(404, 'Post not found');
      }

      if (post.authorId !== authorId) {
        throw new HttpException(403, 'You can only update your own post');
      }

      // Upload new media
      const media = await this.mediaService.uploadMedia(file);

      // Update post with new header image
      const updatedPost = await this.prisma.post.update({
        where: { id: postId },
        data: { headerImageId: media.id },
        include: {
          headerImage: true,
          author: { select: this.safeAuthorSelect },
          categories: true,
          tags: true,
        }
      });

      // Clean up old header image if it exists
      if (post.headerImageId) {
        try {
          await this.mediaService.deleteMedia(post.headerImageId);
        } catch (error) {
          console.warn(`Failed to delete old header image ${post.headerImageId}:`, error);
          // Don't throw error as the main operation succeeded
        }
      }

      return updatedPost;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to update post header image', { originalError: error });
    }
  }

  /**
   * Remove post header image
   */
  public async removePostHeaderImage(postId: number, authorId: number): Promise<Post> {
    try {
      // Verify post exists and belongs to the author
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: { authorId: true, headerImageId: true }
      });

      if (!post) {
        throw new HttpException(404, 'Post not found');
      }

      if (post.authorId !== authorId) {
        throw new HttpException(403, 'You can only update your own post');
      }

      if (!post.headerImageId) {
        throw new HttpException(400, 'Post has no header image to remove');
      }

      // Update post to remove header image
      const updatedPost = await this.prisma.post.update({
        where: { id: postId },
        data: { headerImageId: null },
        include: {
          author: { select: this.safeAuthorSelect },
          categories: true,
          tags: true,
        }
      });

      // Delete the media file
      try {
        await this.mediaService.deleteMedia(post.headerImageId);
      } catch (error) {
        console.warn(`Failed to delete header image ${post.headerImageId}:`, error);
        // Don't throw error as the main operation succeeded
      }

      return updatedPost;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to remove post header image', { originalError: error });
    }
  }

  /**
   * Create a new post.
   * @param data - The data for the new post.
   * @param authorId - The ID of the author creating the post.
   * @returns The created post.
   */
  public async createPost(data: CreatePostDTO, authorId: number): Promise<Post> {
    try {
      // Generate slug if not provided
      const slug = data.slug || await this.generateSlug(data.title);

      // Set publishedAt if status is PUBLISHED and not provided
      const publishedAt = data.status === PostStatusEnum.PUBLISHED && !data.publishedAt
        ? new Date()
        : data.publishedAt;

      const postData: Prisma.PostCreateInput = {
        title: data.title,
        content: data.content,
        slug,
        status: (data.status || PostStatusEnum.DRAFT) as PostStatus,
        approved: data.approved ?? false,
        publishedAt,
        author: {
          connect: { id: authorId }
        }
      };

      // Add header image if provided
      if (data.headerImageId) {
        postData.headerImage = {
          connect: { id: data.headerImageId }
        };
      }

      // Add categories if provided
      if (data.categories && data.categories.length > 0) {
        postData.categories = {
          connect: data.categories.map(id => ({ id }))
        };
      }

      // Add tags if provided
      if (data.tags && data.tags.length > 0) {
        postData.tags = {
          connect: data.tags.map(id => ({ id }))
        };
      }

      return await this.prisma.post.create({
        data: postData,
        include: {
          headerImage: true,
          author: { select: this.safeAuthorSelect },
          categories: true,
          tags: true,
        }
      });
    } catch (error) {
      console.error("Error creating post:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(409, "A post with this slug already exists");
        }
      }
      throw new HttpException(500, "Unable to create post.");
    }
  }

  /**
   * Update an existing post by its ID.
   * @param id - The ID of the post to update.
   * @param data - The updated data for the post.
   * @param authorId - The ID of the author updating the post.
   * @returns The updated post.
   */
  public async updatePost(id: number, data: Partial<UpdatePostDTO>, authorId: number): Promise<Post> {
    try {
      // Verify post exists and belongs to the author
      const existingPost = await this.prisma.post.findUnique({
        where: { id },
        select: { authorId: true, slug: true }
      });

      if (!existingPost) {
        throw new HttpException(404, "Post not found");
      }

      if (existingPost.authorId !== authorId) {
        throw new HttpException(403, "You can only update your own post");
      }

      // Generate new slug if title changed and slug not provided
      let slug = data.slug;
      if (data.title && !data.slug) {
        slug = await this.generateSlug(data.title, id);
      }

      // Set publishedAt if status is changing to PUBLISHED
      let publishedAt = data.publishedAt;
      if (data.status === PostStatusEnum.PUBLISHED && !publishedAt) {
        publishedAt = new Date();
      }

      const updateData: Prisma.PostUpdateInput = {
        title: data.title,
        content: data.content,
        slug,
        publishedAt,
        status: data.status as PostStatus,
        approved: data.approved,
      };

      // Handle header image
      if (data.headerImageId !== undefined) {
        updateData.headerImage = data.headerImageId
          ? { connect: { id: data.headerImageId } }
          : { disconnect: true };
      }

      // Handle categories
      if (data.categories !== undefined) {
        updateData.categories = {
          set: data.categories.map(id => ({ id }))
        };
      }

      // Handle tags
      if (data.tags !== undefined) {
        updateData.tags = {
          set: data.tags.map(id => ({ id }))
        };
      }

      return await this.prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          headerImage: true,
          author: { select: this.safeAuthorSelect },
          categories: true,
          tags: true,
        }
      });
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(409, "A post with this slug already exists");
        }
      }
      throw new HttpException(500, "Unable to update post.");
    }
  }

  /**
   * Delete a post by its ID.
   * @param id - The ID of the post to delete.
   * @param authorId - The ID of the author deleting the post.
   * @returns The deleted post.
   */
  public async deletePost(id: number, authorId: number): Promise<Post> {
    try {
      // Verify post exists and belongs to the author
      const post = await this.prisma.post.findUnique({
        where: { id },
        select: { authorId: true, headerImageId: true }
      });

      if (!post) {
        throw new HttpException(404, "Post not found");
      }

      if (post.authorId !== authorId) {
        throw new HttpException(403, "You can only delete your own post");
      }

      const deletedPost = await this.prisma.post.delete({
        where: { id },
        include: {
          headerImage: true,
          author: { select: this.safeAuthorSelect },
          categories: true,
          tags: true,
        }
      });

      // Clean up header image if it exists
      if (post.headerImageId) {
        try {
          await this.mediaService.deleteMedia(post.headerImageId);
        } catch (error) {
          console.warn(`Failed to delete header image ${post.headerImageId}:`, error);
          // Don't throw error as the main operation succeeded
        }
      }

      return deletedPost;
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, "Unable to delete post.");
    }
  }

  /**
   * Get post statistics
   */
  public async getPostStats(): Promise<PostStats> {
    try {
      const [
        totalPosts,
        publishedPosts,
        draftPosts,
        archivedPosts,
        pendingApproval,
        totalViews,
        averageViews
      ] = await Promise.all([
        this.prisma.post.count(),
        this.prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
        this.prisma.post.count({ where: { status: PostStatus.DRAFT } }),
        this.prisma.post.count({ where: { status: PostStatus.ARCHIVED } }),
        this.prisma.post.count({ where: { approved: false } }),
        this.prisma.post.aggregate({
          _sum: { viewCount: true }
        }),
        this.prisma.post.aggregate({
          _avg: { viewCount: true }
        })
      ]);

      return {
        totalPosts,
        publishedPosts,
        draftPosts,
        archivedPosts,
        pendingApproval,
        totalViews: totalViews._sum.viewCount || 0,
        averageViews: Math.round(averageViews._avg.viewCount || 0)
      };
    } catch (error) {
      console.error("Error getting post stats:", error);
      throw new HttpException(500, "Unable to get post statistics");
    }
  }
}

export default PostService;
