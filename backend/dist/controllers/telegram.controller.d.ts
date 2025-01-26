import { Request, Response, NextFunction } from "express";
declare class TelegramGroupsController {
    private telegramGroupsService;
    getAllTelegramGroups: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getTelegramGroupById: (req: Request, res: Response) => Promise<void>;
    createTelegramGroup: (req: Request, res: Response) => Promise<void>;
    updateTelegramGroup: (req: Request, res: Response) => Promise<void>;
    deleteTelegramGroup: (req: Request, res: Response) => Promise<void>;
}
export default TelegramGroupsController;
