import { Request, Response, NextFunction } from "express";
import PageService from "../services/page.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";
import { HttpException } from "../exceptions/HttpException";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class PagesController {
  private pageService = new PageService();

  public getAllPages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const summaryOnly = req.query.summaryOnly === "true";

      const { pages, count } = await this.pageService.getAllPages(
        skip,
        limit,
        summaryOnly
      );

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        data: pages,
        meta,
        message: "findPages",
      });
    } catch (error) {
      next(error);
    }
  };

  public getPageBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = req.params.slug;
      const page = await this.pageService.getPageBySlug(slug);
      if (!page) {
        res.status(404).json({ message: "Page not found" });
      } else {
        res.status(200).json(page);
      }
    } catch (error) {
      next(error);
    }
  };

  public createPage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = await this.pageService.createPage(req.body);
      res.status(201).json(page);
    } catch (error) {
      next(error);
    }
  };

  public updatePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const page = await this.pageService.updatePage(id, req.body);
      res.status(200).json(page);
    } catch (error) {
      next(error);
    }
  };

  public deletePage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.pageService.deletePage(id);
      res.status(200).json({ message: "Page deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  public uploadPageHeaderImage = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pageId = parseInt(req.params.id, 10);
      
      if (isNaN(pageId)) {
        throw new HttpException(400, 'Invalid page ID');
      }

      if (!req.file) {
        throw new HttpException(400, 'No file uploaded');
      }

      const mediaUpload = {
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        size: req.file.size,
        altText: req.body.altText || `Header image for page ${pageId}`
      };

      const page = await this.pageService.updatePageHeaderImage(pageId, mediaUpload);
      
      res.status(200).json({
        success: true,
        data: {
          id: page.id,
          title: page.title,
          headerImg: (page as any).headerImg
        },
        message: "Page header image updated successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public removePageHeaderImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const pageId = parseInt(req.params.id, 10);
      
      if (isNaN(pageId)) {
        throw new HttpException(400, 'Invalid page ID');
      }

      const page = await this.pageService.removePageHeaderImage(pageId);
      
      res.status(200).json({
        success: true,
        data: {
          id: page.id,
          title: page.title,
          headerImg: null
        },
        message: "Page header image removed successfully"
      });
    } catch (error) {
      next(error);
    }
  };
}

export default PagesController;
