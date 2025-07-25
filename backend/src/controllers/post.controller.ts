import { Request, Response, NextFunction } from "express";
import PostService from "../services/post.service";
import { HttpException } from "../exceptions/HttpException";

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
    limit: unknown
  ): { skip: number; limit: number } {
    const parsedSkip = Number(skip);
    const parsedLimit = Number(limit);

    if (isNaN(parsedSkip) || parsedSkip < 0) {
      throw new HttpException(400, "Invalid skip parameter");
    }

    if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
      throw new HttpException(400, "Invalid limit parameter (1-100)");
    }

    return {
      skip: parsedSkip,
      limit: parsedLimit,
    };
  }

  public getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { skip, limit } = this.validatePaginationParams(
        req.query.skip,
        req.query.limit
      );

      const summaryOnly = req.query.summaryOnly === "true";

      const { posts, count } = await this.postService.getAllPosts(
        skip,
        limit,
        summaryOnly
      );

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
    } catch (error) {
      console.error('Error in getAllPosts:', error);
      if (error instanceof HttpException) {
        res.status(400).json({
          message: error.message,
        });
      } else {
        res.status(500).json({
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
      next(error);
    }
  };

  public getPostBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const post = await this.postService.getPostBySlug(req.params.slug);

      if (!post) {
        res.status(404).json({ message: "Post not found" });
      } else {
        res
          .status(200)
          .json(post);
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  };
  
  public getPostsBySearch = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const term = req.query.term as string;
      const hashtag = req.query.hashtag as string;

      const { skip, limit } = this.validatePaginationParams(req.query.skip, req.query.limit);

      console.log("Search parameters:", { term, hashtag, skip, limit });

      const searchResult = await this.postService.searchPost(
        term,
        hashtag,
        skip,
        limit
      );

      res.status(200).json({
        data: searchResult.posts,
        count: searchResult.count,
        message: 'Posts retrieved successfully'
      });

    } catch (error) {
      const statusCode = error instanceof HttpException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      res.status(statusCode).json({
        message: statusCode === 500 ? 'Internal server error' : errorMessage,
        error: errorMessage
      });

      next(error);
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

      // Include the author ID in the post data
      const postData = {
        ...req.body,
        authorId: userId,
      };

      const post = await this.postService.createPost(postData);
      res
        .status(201)
        .json({ data: post, message: "Post created successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
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

      const isOwner = await this.verifyPostOwnership(id, userId);
      if (!isOwner) {
        res.status(403).json({ message: "You can only update your own post" });
        return;
      }

      const post = await this.postService.updatePost(id, req.body);
      res.status(200).json({ data: post, message: "Post updated successfully" });
    } catch (error) {
      const statusCode = error instanceof HttpException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      res.status(statusCode).json({
        message: statusCode === 500 ? "Internal server error" : errorMessage,
        error: errorMessage
      });
      next(error);
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

      const isOwner = await this.verifyPostOwnership(id, userId);
      if (!isOwner) {
        res.status(403).json({ message: "You can only delete your own post" });
        return;
      }

      await this.postService.deletePost(id);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      const statusCode = error instanceof HttpException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      res.status(statusCode).json({
        message: statusCode === 500 ? "Internal server error" : errorMessage,
        error: errorMessage
      });
      next(error);
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

      if (isNaN(postId)) {
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
      next(error);
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

      if (isNaN(postId)) {
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
      next(error);
    }
  };
}
