import { PrismaClient, Tag, Prisma } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import { prisma } from "../config/database";
import {
  IHashtag,
  IHashtagWithPostCount,
  IHashtagWithRelations,
  CreateHashtagDTO,
  UpdateHashtagDTO,
  HashtagSearchParams,
  HashtagListParams,
  HashtagListResponse,
  HashtagResponse,
  HashtagSearchResponse,
  HashtagStats,
  HashtagOrderBy,
  HashtagOrderDirection
} from "../interfaces/hashtag.interface";

class HashtagService {
  private prisma = prisma;

  /**
   * Generate a unique slug from name
   */
  private async generateSlug(name: string, existingId?: number): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existingTag = await this.prisma.tag.findUnique({
        where: { slug },
        select: { id: true }
      });

      if (!existingTag || existingTag.id === existingId) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Get all hashtags with pagination and optional filtering
   */
  public async getAllHashtags(params: HashtagListParams): Promise<HashtagListResponse> {
    const {
      skip = 0,
      limit = 50,
      orderBy = 'name',
      orderDirection = 'asc',
      includePostCount = true
    } = params;

    try {
      const orderByClause: Prisma.TagOrderByWithRelationInput = {};
      if (orderBy === 'postCount') {
        orderByClause.posts = { _count: orderDirection };
      } else {
        orderByClause[orderBy] = orderDirection;
      }

      const [tags, count] = await Promise.all([
        this.prisma.tag.findMany({
          skip: Number(skip),
          take: Number(limit),
          orderBy: orderByClause,
          include: includePostCount ? {
            _count: {
              select: {
                posts: true,
                sources: true
              }
            }
          } : undefined
        }),
        this.prisma.tag.count()
      ]);

      // Transform to include postCount
      const transformedTags: IHashtagWithPostCount[] = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        postCount: includePostCount ? (tag as any)._count?.posts || 0 : 0
      }));

      const currentPage = Math.floor(skip / limit) + 1;
      const totalPages = Math.ceil(count / limit);

      return {
        data: transformedTags,
        meta: {
          total: count,
          skip,
          limit,
          currentPage,
          totalPages,
        },
        message: "Hashtags retrieved successfully",
      };
    } catch (error) {
      console.error("Error fetching hashtags:", error);
      throw new HttpException(500, "Error fetching hashtags");
    }
  }

  /**
   * Search hashtags by name
   */
  public async searchHashtags(params: HashtagSearchParams): Promise<HashtagSearchResponse> {
    const {
      term,
      skip = 0,
      limit = 20,
      includePosts = false,
      includeSources = false
    } = params;

    if (!term || term.trim().length === 0) {
      throw new HttpException(400, "Search term is required");
    }

    try {
      const decodedTerm = decodeURIComponent(term).trim();

      const whereClause: Prisma.TagWhereInput = {
        OR: [
          { name: { contains: decodedTerm, mode: "insensitive" } },
          { slug: { contains: decodedTerm, mode: "insensitive" } }
        ]
      };

      const includeClause: Prisma.TagInclude = {
        _count: {
          select: {
            posts: true,
            sources: true
          }
        }
      };

      if (includePosts) {
        includeClause.posts = {
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        };
      }

      if (includeSources) {
        includeClause.sources = {
          select: {
            id: true,
            title: true,
            url: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        };
      }

      const [tags, count] = await Promise.all([
        this.prisma.tag.findMany({
          where: whereClause,
          skip: Number(skip),
          take: Number(limit),
          include: includeClause,
          orderBy: [
            { name: 'asc' },
            { createdAt: 'desc' }
          ]
        }),
        this.prisma.tag.count({ where: whereClause })
      ]);

      // Transform to include postCount
      const transformedTags: IHashtagWithPostCount[] = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        postCount: (tag as any)._count?.posts || 0
      }));

      return {
        data: transformedTags,
        count,
        message: 'Hashtags search completed successfully'
      };
    } catch (error) {
      console.error("Error searching hashtags:", error);
      throw new HttpException(500, "Error searching hashtags");
    }
  }

  /**
   * Get hashtag by ID with optional relations
   */
  public async getHashtagById(id: number, includeRelations: boolean = false): Promise<IHashtagWithRelations> {
    try {
      const includeClause: Prisma.TagInclude = {
        _count: {
          select: {
            posts: true,
            sources: true
          }
        }
      };

      if (includeRelations) {
        includeClause.posts = {
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        };
        includeClause.sources = {
          select: {
            id: true,
            title: true,
            url: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        };
      }

      const tag = await this.prisma.tag.findUnique({
        where: { id },
        include: includeClause
      });

      if (!tag) {
        throw new HttpException(404, "Hashtag not found");
      }

      return {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        _count: (tag as any)._count,
        posts: includeRelations ? (tag as any).posts : undefined,
        sources: includeRelations ? (tag as any).sources : undefined
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Error fetching hashtag:", error);
      throw new HttpException(500, "Error fetching hashtag");
    }
  }

  /**
   * Get hashtag by slug
   */
  public async getHashtagBySlug(slug: string, includeRelations: boolean = false): Promise<IHashtagWithRelations> {
    try {
      const includeClause: Prisma.TagInclude = {
        _count: {
          select: {
            posts: true,
            sources: true
          }
        }
      };

      if (includeRelations) {
        includeClause.posts = {
          select: {
            id: true,
            title: true,
            slug: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        };
        includeClause.sources = {
          select: {
            id: true,
            title: true,
            url: true
          },
          orderBy: { createdAt: 'desc' },
          take: 20
        };
      }

      const tag = await this.prisma.tag.findUnique({
        where: { slug },
        include: includeClause
      });

      if (!tag) {
        throw new HttpException(404, "Hashtag not found");
      }

      return {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        _count: (tag as any)._count,
        posts: includeRelations ? (tag as any).posts : undefined,
        sources: includeRelations ? (tag as any).sources : undefined
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Error fetching hashtag by slug:", error);
      throw new HttpException(500, "Error fetching hashtag");
    }
  }

  /**
   * Create a new hashtag
   */
  public async createHashtag(data: CreateHashtagDTO): Promise<Tag> {
    try {
      // Check if hashtag already exists
      const existingTag = await this.prisma.tag.findFirst({
        where: {
          OR: [
            { name: data.name },
            { slug: data.slug || await this.generateSlug(data.name) }
          ]
        }
      });

      if (existingTag) {
        throw new HttpException(409, "Hashtag already exists");
      }

      // Generate slug if not provided
      const slug = data.slug || await this.generateSlug(data.name);

      const tag = await this.prisma.tag.create({
        data: {
          name: data.name,
          slug
        }
      });

      return tag;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(409, "A hashtag with this name or slug already exists");
        }
      }
      console.error("Error creating hashtag:", error);
      throw new HttpException(500, "Error creating hashtag");
    }
  }

  /**
   * Update an existing hashtag
   */
  public async updateHashtag(id: number, data: Partial<UpdateHashtagDTO>): Promise<Tag> {
    try {
      // Check if hashtag exists
      const existingTag = await this.prisma.tag.findUnique({
        where: { id }
      });

      if (!existingTag) {
        throw new HttpException(404, "Hashtag not found");
      }

      // Check for conflicts if name or slug is being updated
      if (data.name || data.slug) {
        const newName = data.name || existingTag.name;
        const newSlug = data.slug || await this.generateSlug(newName, id);

        const conflictingTag = await this.prisma.tag.findFirst({
          where: {
            OR: [
              { name: newName },
              { slug: newSlug }
            ],
            NOT: { id }
          }
        });

        if (conflictingTag) {
          throw new HttpException(409, "A hashtag with this name or slug already exists");
        }
      }

      // Generate new slug if name changed and slug not provided
      let slug = data.slug;
      if (data.name && !data.slug) {
        slug = await this.generateSlug(data.name, id);
      }

      const tag = await this.prisma.tag.update({
        where: { id },
        data: {
          name: data.name,
          slug
        }
      });

      return tag;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(409, "A hashtag with this name or slug already exists");
        }
      }
      console.error("Error updating hashtag:", error);
      throw new HttpException(500, "Error updating hashtag");
    }
  }

  /**
   * Delete a hashtag
   */
  public async deleteHashtag(id: number): Promise<Tag> {
    try {
      // Check if hashtag exists
      const existingTag = await this.prisma.tag.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              posts: true,
              sources: true
            }
          }
        }
      });

      if (!existingTag) {
        throw new HttpException(404, "Hashtag not found");
      }

      // Check if hashtag is in use
      const postCount = (existingTag as any)._count?.posts || 0;
      const sourceCount = (existingTag as any)._count?.sources || 0;

      if (postCount > 0 || sourceCount > 0) {
        throw new HttpException(400, `Cannot delete hashtag that is used by ${postCount} posts and ${sourceCount} sources`);
      }

      const tag = await this.prisma.tag.delete({
        where: { id }
      });

      return tag;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error("Error deleting hashtag:", error);
      throw new HttpException(500, "Error deleting hashtag");
    }
  }

  /**
   * Get hashtag statistics
   */
  public async getHashtagStats(): Promise<HashtagStats> {
    try {
      const [
        totalHashtags,
        hashtagsWithPosts,
        hashtagsWithSources,
        averagePostsPerHashtag,
        mostUsedHashtags
      ] = await Promise.all([
        this.prisma.tag.count(),
        this.prisma.tag.count({
          where: {
            posts: { some: {} }
          }
        }),
        this.prisma.tag.count({
          where: {
            sources: { some: {} }
          }
        }),
        this.prisma.tag.count(),
        this.prisma.tag.findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: {
                posts: true
              }
            }
          },
          orderBy: {
            posts: {
              _count: 'desc'
            }
          },
          take: 10
        })
      ]);

      return {
        totalHashtags,
        hashtagsWithPosts,
        hashtagsWithSources,
        averagePostsPerHashtag: Math.round(hashtagsWithPosts > 0 ? hashtagsWithPosts / totalHashtags : 0),
        mostUsedHashtags: (mostUsedHashtags as any[]).map(tag => ({
          id: tag.id,
          name: tag.name,
          postCount: (tag as any)._count.posts
        }))
      };
    } catch (error) {
      console.error("Error getting hashtag stats:", error);
      throw new HttpException(500, "Unable to get hashtag statistics");
    }
  }

  /**
   * Get trending hashtags (most used in recent posts)
   */
  public async getTrendingHashtags(limit: number = 10, days: number = 30): Promise<IHashtagWithPostCount[]> {
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - days);

      const trendingTags = await this.prisma.tag.findMany({
        where: {
          posts: {
            some: {
              createdAt: {
                gte: dateThreshold
              }
            }
          }
        },
        include: {
          _count: {
            select: {
              posts: {
                where: {
                  createdAt: {
                    gte: dateThreshold
                  }
                }
              }
            }
          }
        },
        orderBy: {
          posts: {
            _count: 'desc'
          }
        },
        take: limit
      });

      return trendingTags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
        postCount: (tag as any)._count.posts
      }));
    } catch (error) {
      console.error("Error getting trending hashtags:", error);
      throw new HttpException(500, "Unable to get trending hashtags");
    }
  }
}

export default HashtagService;