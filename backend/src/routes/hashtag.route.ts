import { Router } from "express";
import HashtagController from "../controllers/hashtag.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

class HashtagRoute implements Routes {
  public path = "/hashtags";
  public router = Router();
  public hashtagController = new HashtagController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.get(`${this.path}`, this.hashtagController.getAllHashtags); // GET /hashtags
    this.router.get(`${this.path}/search`, this.hashtagController.searchHashtags); // GET /hashtags/search
    this.router.get(`${this.path}/trending`, this.hashtagController.getTrendingHashtags); // GET /hashtags/trending
    this.router.get(`${this.path}/stats`, this.hashtagController.getHashtagStats); // GET /hashtags/stats
    this.router.get(`${this.path}/:id`, this.hashtagController.getHashtagById); // GET /hashtags/:id
    this.router.get(`${this.path}/slug/:slug`, this.hashtagController.getHashtagBySlug); // GET /hashtags/slug/:slug
    
    // Admin routes (require authentication and admin role)
    this.router.post(
      `${this.path}`,
      authMiddleware,
      roleMiddleware(['admin', 'superadmin']),
      this.hashtagController.createHashtag
    ); // POST /hashtags
    
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware(['admin', 'superadmin']),
      this.hashtagController.updateHashtag
    ); // PUT /hashtags/:id
    
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware(['admin', 'superadmin']),
      this.hashtagController.deleteHashtag
    ); // DELETE /hashtags/:id
  }
}

export default HashtagRoute;
