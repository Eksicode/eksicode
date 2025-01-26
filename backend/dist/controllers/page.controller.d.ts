import { Request, Response, NextFunction } from "express";
declare class PagesController {
    private pageService;
    getAllPages: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getPageBySlug: (req: Request, res: Response) => Promise<void>;
    createPage: (req: Request, res: Response) => Promise<void>;
    updatePage: (req: Request, res: Response) => Promise<void>;
    deletePage: (req: Request, res: Response) => Promise<void>;
}
export default PagesController;
