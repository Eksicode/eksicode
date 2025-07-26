import { Router } from "express";
import { JobController } from "../controllers/job.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

class JobRoute implements Routes {
  public path = "/jobs";
  public router = Router();
  public jobController = new JobController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.jobController.getAllJobs); // GET /Jobs
    this.router.get(`${this.path}/id/:id`, this.jobController.getJobById); // GET /Jobs/:id
    this.router.get(`${this.path}/slug/:slug`, this.jobController.getJobBySlug); // GET /Jobs/:slug
    this.router.get(`${this.path}/search`, this.jobController.searchJobs); // GET /Jobs/search
    this.router.post(
      `${this.path}`,
      authMiddleware,
      roleMiddleware(['company', 'admin', 'superadmin']),
      this.jobController.createJob
    ); // POST /Jobs
    this.router.put(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware(['company','admin', 'superadmin']),
      this.jobController.updateJob
    ); // PUT /Jobs/:id
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware,
      roleMiddleware(['company', 'admin', 'superadmin']),
      this.jobController.deleteJob
    ); // DELETE /Jobs/:id
  }
}

export default JobRoute;
