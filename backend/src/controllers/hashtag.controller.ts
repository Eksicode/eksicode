import { Request, Response, NextFunction } from "express";
import  HashtagService  from "../services/hashtag.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";

class HashtagController {
  private hashtagService = new HashtagService();

  public getAllHashtags = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);

      const { hashTags, count } = await this.hashtagService.getAllHashtags(
        skip,
        limit,
      );

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        data: hashTags,
        meta,
        message: "findAllHashtags",
      });
    } catch (error) {
      next(error);
    }
  };

  public getHashtagById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const hashtag = await this.hashtagService.getHashtagById(id);
      res.status(200).json({ data: hashtag, message: "findHashtag" });
    } catch (error) {
      next(error);
    }
  };

  public createHashtag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const hashtag = await this.hashtagService.createHashtag(req.body);
      res.status(201).json({ data: hashtag, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public updateHashtag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const hashtag = await this.hashtagService.updateHashtag(id, req.body);
      res.status(200).json({ data: hashtag, message: "updated" });
    } catch (error) {
      next(error);
    }
  }

  public deleteHashtag = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.hashtagService.deleteHashtag(id);
      res.status(200).json({ message: "deleted" });
    } catch (error) {
      next(error);
    }
  }
}

export default HashtagController;