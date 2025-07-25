import { Request, Response, NextFunction } from "express";
import MediaService from "../services/media.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";
import { HttpException } from "../exceptions/HttpException";
import { MediaType } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class MediaController {
  private mediaService: MediaService;

  constructor(prisma?: PrismaClient) {
    this.mediaService = new MediaService(prisma || new PrismaClient());
  }

  public getAllMedia = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const type = req.query.type as MediaType | undefined;

      const { media, count } = await this.mediaService.getAllMedia(skip, limit, type);

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        success: true,
        data: media,
        meta,
        message: "Media files retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public getMediaById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid media ID');
      }
      
      const media = await this.mediaService.getMediaById(id);
      
      if (!media) {
        throw new HttpException(404, 'Media not found');
      }
      
      res.status(200).json({
        success: true,
        data: media,
        message: "Media retrieved successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadMedia = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.file) {
        throw new HttpException(400, 'No file uploaded');
      }

      const mediaUpload = {
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        size: req.file.size,
        altText: req.body.altText || undefined
      };

      const media = await this.mediaService.uploadMedia(mediaUpload);
      
      res.status(201).json({
        success: true,
        data: media,
        message: "Media uploaded successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public updateMediaMetadata = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid media ID');
      }

      const { altText } = req.body;

      const media = await this.mediaService.updateMedia(id, { altText });
      
      res.status(200).json({
        success: true,
        data: media,
        message: "Media metadata updated successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid media ID');
      }

      await this.mediaService.deleteMedia(id);
      
      res.status(200).json({
        success: true,
        message: "Media deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public cleanupUnusedMedia = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.mediaService.cleanupUnusedMedia();
      
      res.status(200).json({
        success: true,
        data: {
          deletedCount: result.deletedCount,
          errors: result.errors
        },
        message: `Cleanup completed. ${result.deletedCount} unused media files deleted.`
      });
    } catch (error) {
      next(error);
    }
  };
}

export default MediaController; 