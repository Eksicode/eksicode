import { Router } from "express";
import CompanyController from "../controllers/company.controller";
import { Routes } from "../interfaces/routes.interface";
import authMiddleware from "../middlewares/auth.middleware";
import { uploadSingle, handleUploadError } from "../middlewares/upload.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

class CompanyRoute implements Routes {
  public path = "/companies";
  public router = Router();
  public companyController = new CompanyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Public routes
    this.router.get(`${this.path}`, this.companyController.getAllCompanies); // GET /companies
    this.router.get(`${this.path}/search`, this.companyController.searchCompanies); // GET /companies/search
    this.router.get(`${this.path}/:id`, this.companyController.getCompanyById); // GET /companies/:id
    
    // Protected routes (admin only for company management)
    this.router.post(`${this.path}`, 
      authMiddleware, 
      roleMiddleware(['admin', 'superadmin']),
      this.companyController.createCompany
    ); // POST /companies
    
    this.router.put(`${this.path}/:id`, 
      authMiddleware, 
      roleMiddleware(['admin', 'superadmin']),
      this.companyController.updateCompany
    ); // PUT /companies/:id
    
    this.router.delete(`${this.path}/:id`, 
      authMiddleware, 
      roleMiddleware(['admin', 'superadmin']),
      this.companyController.deleteCompany
    ); // DELETE /companies/:id
    
    // Logo upload routes (admin only)
    this.router.post(`${this.path}/:id/logo`, 
      authMiddleware, 
      roleMiddleware(['admin', 'superadmin']),
      uploadSingle('logo'), 
      handleUploadError,
      this.companyController.uploadCompanyLogo
    ); // POST /companies/:id/logo
    
    this.router.delete(`${this.path}/:id/logo`, 
      authMiddleware, 
      roleMiddleware(['admin', 'superadmin']),
      this.companyController.removeCompanyLogo
    ); // DELETE /companies/:id/logo
  }
}

export default CompanyRoute; 