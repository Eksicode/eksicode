import { Router } from "express";
import SourceController from "../controllers/source.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import roleMiddleware from "../middlewares/role.middleware";
class SourceRoute implements Routes {
  public path = "/sources";
  public router = Router();
  public sourceController = new SourceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.sourceController.getAllSources);
    this.router.get(`${this.path}/search`, this.sourceController.searchSources);
    this.router.get(`${this.path}/:id`, this.sourceController.getSourceById);
    this.router.post(
      `${this.path}`,
      authMiddleware,
      roleMiddleware(['admin', 'superadmin']),
      this.sourceController.createSource
    );
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware(['admin', 'superadmin']),
      this.sourceController.updateSource
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware(['admin', 'superadmin']),
      this.sourceController.deleteSource
    );
  }
}

export default SourceRoute;
