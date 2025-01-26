import { Request, Response, NextFunction } from "express";
declare class HashtagController {
    private hashtagService;
    getAllHashtags: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getHashtagById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    createHashtag: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateHashtag: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteHashtag: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
export default HashtagController;
