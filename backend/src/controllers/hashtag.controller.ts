import { Request, Response, NextFunction } from "express";
import HashtagService from "../services/hashtag.service";
import { HttpException } from "../exceptions/HttpException";
import { 
  HashtagListParams, 
  HashtagSearchParams, 
  CreateHashtagDTO, 
  UpdateHashtagDTO 
} from "../interfaces/hashtag.interface";

class HashtagController {
  private hashtagService = new HashtagService();

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

  private validateCreateHashtagData(data: any): CreateHashtagDTO {
    const { name, slug } = data;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new HttpException(400, "Name is required and must be a non-empty string");
    }

    const validatedData: CreateHashtagDTO = {
      name: name.trim(),
    };

    if (slug !== undefined) {
      if (typeof slug !== 'string' || slug.trim().length === 0) {
        throw new HttpException(400, "Slug must be a non-empty string");
      }
      validatedData.slug = slug.trim();
    }

    return validatedData;
  }

  private validateUpdateHashtagData(data: any): Partial<UpdateHashtagDTO> {
    const { name, slug } = data;

    const validatedData: Partial<UpdateHashtagDTO> = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        throw new HttpException(400, "Name must be a non-empty string");
      }
      validatedData.name = name.trim();
    }

    if (slug !== undefined) {
      if (typeof slug !== 'string' || slug.trim().length === 0) {
        throw new HttpException(400, "Slug must be a non-empty string");
      }
      validatedData.slug = slug.trim();
    }

    return validatedData;
  }

  public getAllHashtags = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { skip, limit } = this.validatePaginationParams(
        req.query.skip,
        req.query.limit
      );

      const params: HashtagListParams = {
        skip,
        limit,
        orderBy: req.query.orderBy as any || 'name',
        orderDirection: req.query.orderDirection as any || 'asc',
        includePostCount: req.query.includePostCount !== "false", // Default to true
      };

      const result = await this.hashtagService.getAllHashtags(params);

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
  };

  public searchHashtags = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { skip, limit } = this.validatePaginationParams(req.query.skip, req.query.limit);

      const params: HashtagSearchParams = {
        term: req.query.term as string,
        skip,
        limit,
        includePosts: req.query.includePosts === "true",
        includeSources: req.query.includeSources === "true",
      };

      const result = await this.hashtagService.searchHashtags(params);

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
  };

  public getHashtagById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const includeRelations = req.query.includeRelations === "true";

      if (isNaN(id) || id <= 0) {
        res.status(400).json({ message: "Invalid hashtag ID" });
        return;
      }

      const hashtag = await this.hashtagService.getHashtagById(id, includeRelations);
      
      res.status(200).json({ 
        data: hashtag, 
        message: "Hashtag retrieved successfully" 
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

  public getHashtagBySlug = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { slug } = req.params;
      const includeRelations = req.query.includeRelations === "true";

      if (!slug) {
        res.status(400).json({ message: "Slug parameter is required" });
        return;
      }

      const hashtag = await this.hashtagService.getHashtagBySlug(slug, includeRelations);
      
      res.status(200).json({ 
        data: hashtag, 
        message: "Hashtag retrieved successfully" 
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

  public createHashtag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const validatedData = this.validateCreateHashtagData(req.body);
      const hashtag = await this.hashtagService.createHashtag(validatedData);
      
      res.status(201).json({ 
        data: hashtag, 
        message: "Hashtag created successfully" 
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

  public updateHashtag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id) || id <= 0) {
        res.status(400).json({ message: "Invalid hashtag ID" });
        return;
      }

      const validatedData = this.validateUpdateHashtagData(req.body);
      const hashtag = await this.hashtagService.updateHashtag(id, validatedData);
      
      res.status(200).json({ 
        data: hashtag, 
        message: "Hashtag updated successfully" 
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
  }

  public deleteHashtag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);

      if (isNaN(id) || id <= 0) {
        res.status(400).json({ message: "Invalid hashtag ID" });
        return;
      }

      await this.hashtagService.deleteHashtag(id);
      res.status(200).json({ message: "Hashtag deleted successfully" });
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

  public getHashtagStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const stats = await this.hashtagService.getHashtagStats();
      
      res.status(200).json({
        data: stats,
        message: "Hashtag statistics retrieved successfully"
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

  public getTrendingHashtags = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 30;

      if (isNaN(limit) || limit <= 0 || limit > 50) {
        res.status(400).json({ message: "Limit must be between 1 and 50" });
        return;
      }

      if (isNaN(days) || days <= 0 || days > 365) {
        res.status(400).json({ message: "Days must be between 1 and 365" });
        return;
      }

      const trendingHashtags = await this.hashtagService.getTrendingHashtags(limit, days);
      
      res.status(200).json({
        data: trendingHashtags,
        message: "Trending hashtags retrieved successfully"
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

export default HashtagController;