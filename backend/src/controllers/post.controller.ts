import { Request, Response, NextFunction } from "express";
import PostService from "../services/post.service";
import { HttpException } from "../exceptions/HttpException";

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
      const term = req.params.term;
      const { skip, limit } = this.validatePaginationParams(
        req.query.skip,
        req.query.limit
      );
      const { posts, count } = await this.postService.searchPost(term, skip, limit);
      res
        .status(200)
        .json({ data: posts, message: "Posts retrieved successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  };

  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const post = await this.postService.createPost(req.body);
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

  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const post = await this.postService.updatePost(id, req.body);
      res
        .status(200)
        .json({ data: post, message: "Post updated successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
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
      await this.postService.deletePost(id);
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  };
}
