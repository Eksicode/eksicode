import { Request, Response, NextFunction } from "express";
import PageService from "../services/page.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";

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
      res.status(500).json({ message: error.message });
    }
  };

  public getPageBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const slug = req.params.slug;
      const page = await this.pageService.getPageBySlug(slug);
      if (!page) {
        res.status(404).json({ message: "Page not found" });
      } else {
        res.status(200).json(page);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

//   public getPageById = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const id = parseInt(req.params.id, 10);
//       const page = await this.pageService.getPageById(id);
//       if (!page) {
//         res.status(404).json({ message: "Page not found" });
//       } else {
//         res.status(200).json(page);
//       }
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

  public createPage = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = await this.pageService.createPage(req.body);
      res.status(201).json(page);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public updatePage = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const page = await this.pageService.updatePage(id, req.body);
      res.status(200).json(page);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  public deletePage = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const page = await this.pageService.deletePage(id);
      res.status(200).json({ message: "Page deleted successfully", page });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

export default PagesController;
