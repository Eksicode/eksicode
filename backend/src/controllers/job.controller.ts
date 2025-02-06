import { Request, Response, NextFunction } from "express";
import JobService from "../services/job.service";
import { HttpException } from "../exceptions/HttpException";

export class JobController {
  private jobService: JobService;

  constructor(jobService?: JobService) {
    this.jobService = jobService || new JobService();
  }

  private validatePaginationParams(
    skip: unknown,
    limit: unknown
  ): { skip: number; limit: number } {
    const parsedSkip = Number(skip);
    const parsedLimit = Number(limit);

    if (isNaN(parsedSkip) || parsedSkip < 0) {
      throw new HttpException(400, "Invalid skip parameter");
    }

    if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100) {
      throw new HttpException(400, "Invalid limit parameter (1-100)");
    }

    return {
      skip: parsedSkip,
      limit: parsedLimit,
    };
  }

  public getAllJobs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { skip, limit } = this.validatePaginationParams(
        req.query.skip,
        req.query.limit
      );

      const { jobs, count } = await this.jobService.getAllJobs(skip, limit);

      res.status(200).json({
        data: jobs,
        meta: {
          total: count,
          skip,
          limit,
          currentPage: Math.floor(skip / limit) + 1,
          totalPages: Math.ceil(count / limit),
        },
        message: "Jobs retrieved successfully",
      });
    } catch (error) {
      console.error('Error in getAllJobs:', error);
      if (error instanceof HttpException) {
        res.status(400).json({
          message: error.message,
        });
      } else {
        res.status(500).json({
          message: "Internal server error",
          error: error instanceof Error ? error.message : String(error),
        });
      }
      next(error);
    }
  };

  public getJobById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const jobId = parseInt(req.params.id, 10);
      const job = await this.jobService.getJobById(jobId);

      if (!job) {
        res.status(404).json({ message: "Job not found" });
      } else {
        res.status(200).json(job);
      }
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  };
  
  public searchJobs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { skip, limit } = this.validatePaginationParams(req.query.skip, req.query.limit);
      const { location, department, employmentType } = req.query;
      
      const searchResult = await this.jobService.searchJobs(
        skip,
        limit,
        {
          location: location as string,
          department: department as string,
          employmentType: employmentType as string
        }
      );

      res.status(200).json({
        data: searchResult.jobs,
        meta: {
          total: searchResult.count,
          skip,
          limit,
          currentPage: Math.floor(skip / limit) + 1,
          totalPages: Math.ceil(searchResult.count / limit),
        },
        message: 'Jobs retrieved successfully'
      });
    } catch (error) {
      const statusCode = error instanceof HttpException ? error.status : 500;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      res.status(statusCode).json({
        message: statusCode === 500 ? 'Internal server error' : errorMessage,
        error: errorMessage
      });
      next(error);
    }
  }

  public createJob = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const job = await this.jobService.createJob(req.body);
      res
        .status(201)
        .json({ data: job, message: "Job created successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  };

  public updateJob = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const job = await this.jobService.updateJob(id, req.body);
      res
        .status(200)
        .json({ data: job, message: "Job updated successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  };

  public deleteJob = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      await this.jobService.deleteJob(id);
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error),
      });
      next(error);
    }
  };
}
