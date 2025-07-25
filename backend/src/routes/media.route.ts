import { Router } from "express";
import MediaController from "../controllers/media.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import { uploadSingle, handleUploadError } from "../middlewares/upload.middleware";
import roleMiddleware from "../middlewares/role.middleware";

class MediaRoute implements Routes {
  public path = "/media";
  public router = Router();
  public mediaController = new MediaController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.get(`${this.path}/:id`, this.mediaController.getMediaById); // GET /media/:id
    
    // Protected routes
    this.router.get(`${this.path}`, authMiddleware, this.mediaController.getAllMedia); // GET /media
    this.router.post(`${this.path}/upload`, 
      authMiddleware, 
      uploadSingle('file'), 
      handleUploadError,
      this.mediaController.uploadMedia
    ); // POST /media/upload
    
    this.router.put(`${this.path}/:id`, 
      authMiddleware, 
      this.mediaController.updateMediaMetadata
    ); // PUT /media/:id
    
    this.router.delete(`${this.path}/:id`, 
      authMiddleware, 
      this.mediaController.deleteMedia
    ); // DELETE /media/:id
    
    // Admin only routes
    this.router.post(`${this.path}/cleanup`, 
      authMiddleware, 
      roleMiddleware(['admin', 'superadmin']),
      this.mediaController.cleanupUnusedMedia
    ); // POST /media/cleanup
  }
}

export default MediaRoute; 