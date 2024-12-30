import { Router } from "express";
import TelegramGroupsController from "../controllers/telegram.controller";
import { Routes } from "../interfaces/routes.interface";

class UserRoute implements Routes {
  public path = "/telegrams";
  public router = Router();
  public telegramGroupsController = new TelegramGroupsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.telegramGroupsController.getAllTelegramGroups); // GET /telegrams

    this.router.get(`${this.path}/:id`, this.telegramGroupsController.getTelegramGroupById); // GET /telegrams/:id

    this.router.post(`${this.path}`, this.telegramGroupsController.createTelegramGroup); // POST /telegrams

    this.router.put(`${this.path}/:id`, this.telegramGroupsController.updateTelegramGroup); // PUT /telegrams/:id

    this.router.delete(`${this.path}/:id`, this.telegramGroupsController.deleteTelegramGroup); // DELETE /telegrams/:id
  }
}

export default UserRoute;
