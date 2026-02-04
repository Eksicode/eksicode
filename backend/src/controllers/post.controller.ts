import { Request, Response, NextFunction } from "express";
import PostService from "../services/post.service";
import { HttpException } from "../exceptions/HttpException";
import { 
  PostListParams, 
  PostSearchParams, 
  CreatePostDTO, 
  UpdatePostDTO,
  PostStatusEnum 
} from "../interfaces/post.interface";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export class PostController {
  private postService: PostService;

  constructor(postService?: PostService) {
    this.postService = postService || new PostService();
  }

  private validatePaginationParams(
    skip: unknown,
    limit: unknown,
    page?: unknown
  ): { skip: number; limit: number } {
    const parsedLimit =
      limit !== undefined && limit !== "" && !Number.isNaN(Number(limit))
        ? Number(limit)
        : 10;
    if (parsedLimit <= 0 || parsedLimit > 100) {
      throw new HttpException(400, "Invalid limit parameter (1-100)");
    }

    let parsedSkip: number;
    if (skip !== undefined && skip !== "" && !Number.isNaN(Number(skip))) {
      parsedSkip = Number(skip);
    } else if (page !== undefined && page !== "" && !Number.isNaN(Number(page))) {
      const p = Number(page);
      if (p < 1) throw new HttpException(400, "Invalid page parameter");
      parsedSkip = (p - 1) * parsedLimit;
    } else {
      parsedSkip = 0;
    }
    if (parsedSkip < 0) {
      throw new HttpException(400, "Invalid skip parameter");
    }

    return {
      skip: parsedSkip,
      limit: parsedLimit,
    };
  }

  private validateCreatePostData(data: any): CreatePostDTO {
    const { title, content, headerImageId, categories, tags, status, slug, approved, publishedAt } = data;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      throw new HttpException(400, "Title is required and must be a non-empty string");
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      throw new HttpException(400, "Content is required and must be a non-empty string");
    }

    const validatedData: CreatePostDTO = {
      title: title.trim(),
      content: content.trim(),
    };

    // Optional fields
    if (headerImageId !== undefined) {
      if (typeof headerImageId !== 'number' || headerImageId <= 0) {
        throw new HttpException(400, "Header image ID must be a positive number");
      }
      validatedData.headerImageId = headerImageId;
    }

    if (categories !== undefined) {
      if (!Array.isArray(categories) || !categories.every(id => typeof id === 'number' && id > 0)) {
        throw new HttpException(400, "Categories must be an array of positive numbers");
      }
      validatedData.categories = categories;
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags) || !tags.every(id => typeof id === 'number' && id > 0)) {
        throw new HttpException(400, "Tags must be an array of positive numbers");
      }
      validatedData.tags = tags;
    }

    if (status !== undefined) {
      if (!Object.values(PostStatusEnum).includes(status)) {
        throw new HttpException(400, "Invalid status value");
      }
      validatedData.status = status;
    }

    if (slug !== undefined) {
      if (typeof slug !== 'string' || slug.trim().length === 0) {
        throw new HttpException(400, "Slug must be a non-empty string");
      }
      validatedData.slug = slug.trim();
    }

    if (approved !== undefined) {
      if (typeof approved !== 'boolean') {
        throw new HttpException(400, "Approved must be a boolean value");
      }
      validatedData.approved = approved;
    }

    if (publishedAt !== undefined) {
      const parsedDate = new Date(publishedAt);
      if (isNaN(parsedDate.getTime())) {
        throw new HttpException(400, "Published at must be a valid date");
      }
      validatedData.publishedAt = parsedDate;
    }

    return validatedData;
  }

  private validateUpdatePostData(data: any): Partial<UpdatePostDTO> {
    const { title, content, headerImageId, categories, tags, status, slug, approved, publishedAt } = data;

    const validatedData: Partial<UpdatePostDTO> = {};

    // Optional fields
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        throw new HttpException(400, "Title must be a non-empty string");
      }
      validatedData.title = title.trim();
    }

    if (content !== undefined) {
      if (typeof content !== 'string' || content.trim().length === 0) {
        throw new HttpException(400, "Content must be a non-empty string");
      }
      validatedData.content = content.trim();
    }

    if (headerImageId !== undefined) {
      if (typeof headerImageId !== 'number' || headerImageId <= 0) {
        throw new HttpException(400, "Header image ID must be a positive number");
      }
      validatedData.headerImageId = headerImageId;
    }

    if (categories !== undefined) {
      if (!Array.isArray(categories) || !categories.every(id => typeof id === 'number' && id > 0)) {
        throw new HttpException(400, "Categories must be an array of positive numbers");
      }
      validatedData.categories = categories;
    }

    if (tags !== undefined) {
      if (!Array.isArray(tags) || !tags.every(id => typeof id === 'number' && id > 0)) {
        throw new HttpException(400, "Tags must be an array of positive numbers");
      }
      validatedData.tags = tags;
    }

    if (status !== undefined) {
      if (!Object.values(PostStatusEnum).includes(status)) {
        throw new HttpException(400, "Invalid status value");
      }
      validatedData.status = status;
    }

    if (slug !== undefined) {
      if (typeof slug !== 'string' || slug.trim().length === 0) {
        throw new HttpException(400, "Slug must be a non-empty string");
      }
      validatedData.slug = slug.trim();
    }

    if (approved !== undefined) {
      if (typeof approved !== 'boolean') {
        throw new HttpException(400, "Approved must be a boolean value");
      }
      validatedData.approved = approved;
    }

    if (publishedAt !== undefined) {
      const parsedDate = new Date(publishedAt);
      if (isNaN(parsedDate.getTime())) {
        throw new HttpException(400, "Published at must be a valid date");
      }
      validatedData.publishedAt = parsedDate;
    }

    return validatedData;
  }

  public getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { skip, limit } = this.validatePaginationParams(
        req.query.skip,
        req.query.limit,
        req.query.page
      );

      const params: PostListParams = {
        skip,
        limit,
        summaryOnly: req.query.summaryOnly === "true",
        // Only set status if explicitly provided, otherwise don't filter by status
        status: req.query.status ? (req.query.status as PostStatusEnum) : undefined,
        // Only set approved if explicitly provided, otherwise don't filter by approval
        approved: req.query.approved !== undefined 
          ? req.query.approved === "true" 
          : undefined,
        authorId: req.query.authorId ? Number(req.query.authorId) : undefined,
        categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
        tagId: req.query.tagId ? Number(req.query.tagId) : undefined,
      };

      const result = await this.postService.getAllPosts(params);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      
      if (res.headersSent) {
        return next(error);
      }
      
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };

  public getPostBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { slug } = req.params;
      const incrementView = req.query.incrementView === "true";

      if (!slug) {
        res.status(400).json({ message: "Slug parameter is required" });
        return;
      }

      const post = await this.postService.getPostBySlug(slug, incrementView);

      if (!post) {
        res.status(404).json({ message: "Post not found" });
      } else {
        res.status(200).json({
          data: post,
          message: "Post retrieved successfully"
        });
      }
    } catch (error) {
      if (res.headersSent) {
        return next(error);
      }
      
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };
  
  public getPostsBySearch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { skip, limit } = this.validatePaginationParams(req.query.skip, req.query.limit, req.query.page);

      const params: PostSearchParams = {
        term: req.query.term as string,
        hashtag: req.query.hashtag as string,
        category: req.query.category as string,
        author: req.query.author as string,
        status: req.query.status as PostStatusEnum || PostStatusEnum.PUBLISHED,
        approved: req.query.approved !== "false", // Default to true
        skip,
        limit
      };

      console.log("Search parameters:", params);

      const result = await this.postService.searchPosts(params);

      res.status(200).json(result);
    } catch (error) {
      if (res.headersSent) {
        return next(error);
      }
      
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId;
      
      if (!userId) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      const validatedData = this.validateCreatePostData(req.body);
      const post = await this.postService.createPost(validatedData, userId);
      
      res.status(201).json({ 
        data: post, 
        message: "Post created successfully" 
      });
    } catch (error) {
      if (res.headersSent) {
        return next(error);
      }
      
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };

  private async verifyPostOwnership(postId: number, userId: number): Promise<boolean> {
    const post = await this.postService.getPostById(postId);
    return post?.authorId === userId;
  }

  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      if (isNaN(id) || id <= 0) {
        res.status(400).json({ message: "Invalid post ID" });
        return;
      }

      const isOwner = await this.verifyPostOwnership(id, userId);
      if (!isOwner) {
        res.status(403).json({ message: "You can only update your own post" });
        return;
      }

      const validatedData = this.validateUpdatePostData(req.body);
      const post = await this.postService.updatePost(id, validatedData, userId);
      
      res.status(200).json({ 
        data: post, 
        message: "Post updated successfully" 
      });
    } catch (error) {
      if (res.headersSent) {
        return next(error);
      }
      
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const userId = req.userId;

      if (!userId) {
        res.status(401).json({ message: "Authentication required" });
        return;
      }

      if (isNaN(id) || id <= 0) {
        res.status(400).json({ message: "Invalid post ID" });
        return;
      }

      const isOwner = await this.verifyPostOwnership(id, userId);
      if (!isOwner) {
        res.status(403).json({ message: "You can only delete your own post" });
        return;
      }

      await this.postService.deletePost(id, userId);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      if (res.headersSent) {
        return next(error);
      }
      
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };

  public getPostStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const stats = await this.postService.getPostStats();
      
      res.status(200).json({
        data: stats,
        message: "Post statistics retrieved successfully"
      });
    } catch (error) {
      if (res.headersSent) {
        return next(error);
      }
      
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };

  public uploadPostHeaderImage = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = parseInt(req.params.id, 10);
      const userId = req.userId;
      
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      if (isNaN(postId) || postId <= 0) {
        res.status(400).json({ message: 'Invalid post ID' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const mediaUpload = {
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        size: req.file.size,
        altText: req.body.altText || `Header image for post ${postId}`
      };

      const post = await this.postService.updatePostHeaderImage(postId, mediaUpload, userId);
      
      res.status(200).json({
        success: true,
        data: {
          id: post.id,
          title: post.title,
          headerImage: (post as any).headerImage
        },
        message: "Post header image updated successfully"
      });
    } catch (error) {
      if (res.headersSent) {
        return next(error);
      }
      
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };

  public removePostHeaderImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const postId = parseInt(req.params.id, 10);
      const userId = req.userId;
      
      if (!userId) {
        res.status(401).json({ message: 'Authentication required' });
        return;
      }

      if (isNaN(postId) || postId <= 0) {
        res.status(400).json({ message: 'Invalid post ID' });
        return;
      }

      const post = await this.postService.removePostHeaderImage(postId, userId);
      
      res.status(200).json({
        success: true,
        data: {
          id: post.id,
          title: post.title,
          headerImage: null
        },
        message: "Post header image removed successfully"
      });
    } catch (error) {
      if (res.headersSent) {
        return next(error);
      }
      
      if (error instanceof HttpException) {
        res.status(error.status).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  };
}
