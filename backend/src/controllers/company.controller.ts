import { Request, Response, NextFunction } from "express";
import CompanyService from "../services/company.service";
import { getPaginationParams, getPaginationMeta } from "../utils/pagination";
import { HttpException } from "../exceptions/HttpException";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class CompanyController {
  private companyService = new CompanyService();

  public getAllCompanies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const summaryOnly = req.query.summaryOnly === "true";

      const { companies, count } = await this.companyService.getAllCompanies(
        skip,
        limit,
        summaryOnly
      );

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        success: true,
        data: companies,
        meta,
        message: "Companies retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public getCompanyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid company ID');
      }
      
      const company = await this.companyService.getCompanyById(id);
      
      if (!company) {
        throw new HttpException(404, 'Company not found');
      }
      
      res.status(200).json({
        success: true,
        data: company,
        message: "Company retrieved successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public searchCompanies = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { page, limit, skip } = getPaginationParams(req.query);
      const term = req.query.term as string;

      if (!term) {
        throw new HttpException(400, 'Search term is required');
      }

      const { companies, count } = await this.companyService.searchCompanies(term, skip, limit);

      const meta = getPaginationMeta(count, page, limit);

      res.status(200).json({
        success: true,
        data: companies,
        meta,
        message: "Companies search completed successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public createCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const company = await this.companyService.createCompany(req.body);
      
      res.status(201).json({
        success: true,
        data: company,
        message: "Company created successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid company ID');
      }

      const company = await this.companyService.updateCompany(id, req.body);
      
      res.status(200).json({
        success: true,
        data: company,
        message: "Company updated successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        throw new HttpException(400, 'Invalid company ID');
      }

      await this.companyService.deleteCompany(id);
      
      res.status(200).json({
        success: true,
        message: "Company deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public uploadCompanyLogo = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = parseInt(req.params.id, 10);
      
      if (isNaN(companyId)) {
        throw new HttpException(400, 'Invalid company ID');
      }

      if (!req.file) {
        throw new HttpException(400, 'No file uploaded');
      }

      const mediaUpload = {
        originalName: req.file.originalname,
        buffer: req.file.buffer,
        mimeType: req.file.mimetype,
        size: req.file.size,
        altText: req.body.altText || `Logo for company ${companyId}`
      };

      const company = await this.companyService.updateCompanyLogo(companyId, mediaUpload);
      
      res.status(200).json({
        success: true,
        data: {
          id: company.id,
          name: company.name,
          logo: (company as any).logo
        },
        message: "Company logo updated successfully"
      });
    } catch (error) {
      next(error);
    }
  };

  public removeCompanyLogo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const companyId = parseInt(req.params.id, 10);
      
      if (isNaN(companyId)) {
        throw new HttpException(400, 'Invalid company ID');
      }

      const company = await this.companyService.removeCompanyLogo(companyId);
      
      res.status(200).json({
        success: true,
        data: {
          id: company.id,
          name: company.name,
          logo: null
        },
        message: "Company logo removed successfully"
      });
    } catch (error) {
      next(error);
    }
  };
}

export default CompanyController; 