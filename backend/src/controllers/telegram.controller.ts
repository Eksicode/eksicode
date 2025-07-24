import { Request, Response, NextFunction } from "express";
import TelegramGroupsService from "../services/telegram.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";

class TelegramGroupsController {
  private telegramGroupsService = new TelegramGroupsService();

  public getAllTelegramGroups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const summaryOnly = req.query.summaryOnly === "true";

      const { telegrams, count }  = await this.telegramGroupsService.getAllTelegramGroups(
        skip,
        limit,
        summaryOnly,
      );

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        data: telegrams,
        meta,
        message: "findAllTelegramGroups",
      });
    } catch (error) {
      next(error);
    }
  };

  public getTelegramGroupById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const telegramGroup = await this.telegramGroupsService.getTelegramGroupById(id);
      if (!telegramGroup) {
        res.status(404).json({ message: "Telegram Group not found" });
      } else {
        res.status(200).json(telegramGroup);
      }
    } catch (error) {
      next(error);
    }
  };

  public createTelegramGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const telegramGroup = await this.telegramGroupsService.createTelegramGroup(req.body);
      res.status(201).json(telegramGroup);
    } catch (error) {
      next(error);
    }
  };

  public updateTelegramGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const telegramGroup = await this.telegramGroupsService.updateTelegramGroup(id, req.body);
      res.status(200).json(telegramGroup);
    } catch (error) {
      next(error);
    }
  };

  public deleteTelegramGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.telegramGroupsService.deleteTelegramGroup(id);
      res.status(200).json({ message: "Telegram Group deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export default TelegramGroupsController;
