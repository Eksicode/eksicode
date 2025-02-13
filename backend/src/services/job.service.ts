import { PrismaClient, Job, Prisma } from "@prisma/client";
import { isEmpty } from "../utils/util";
import { HttpException } from "../exceptions/HttpException";

class JobService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Fetch all jobs with pagination.
   * @param skip - Number of records to skip for pagination.
   * @param limit - Number of records to fetch.
   * @returns An object containing the list of jobs and the total count.
   */
  public async getAllJobs(
    skip: number,
    limit: number
  ): Promise<{ jobs: Job[]; count: number }> {
    const [jobs, count] = await Promise.all([
      this.prisma.job.findMany({
        skip: Number(skip),
        take: Number(limit),
        include: {
          company: true,
        },
        orderBy: [
          { createdAt: "desc" },
          { id: "desc" },
        ],
      }),
      this.prisma.job.count(),
    ]);

    return { jobs, count };
  }

  /**
   * Search jobs with filters and pagination.
   * @param skip - Number of records to skip for pagination.
   * @param limit - Number of records to fetch.
   * @param filters - Object containing search filters.
   * @returns An object containing the filtered jobs and total count.
   */
  public async searchJobs(
    skip: number = 0,
    limit: number = 10,
    filters: {
      location?: string;
      department?: string;
      employmentType?: string;
    }
  ): Promise<{ jobs: Job[]; count: number }> {
    try {
      const whereClause: Prisma.JobWhereInput = {};

      if (filters.location) {
        whereClause.location = {
          contains: filters.location,
          mode: "insensitive",
        };
      }

      if (filters.department) {
        whereClause.department = {
          contains: filters.department,
          mode: "insensitive",
        };
      }

      // if (filters.employmentType) {
      //  whereClause.EmploymentType = filters.employmentType as Prisma.JobEmploymentTypeEnum;
      // }

      const [jobs, count] = await Promise.all([
        this.prisma.job.findMany({
          where: whereClause,
          skip: Number(skip),
          take: Number(limit),
          include: {
            company: true,
          },
          orderBy: [
            { createdAt: "desc" },
            { id: "desc" },
          ],
        }),
        this.prisma.job.count({
          where: whereClause,
        }),
      ]);

      return { jobs, count };
    } catch (error) {
      console.error("Error searching jobs:", error);
      throw new HttpException(500, "Error searching jobs");
    }
  }

  /**
   * Fetch a specific job by its ID.
   * @param id - The ID of the job.
   * @returns The job if found, or null if not.
   */
  public async getJobById(id: number): Promise<Job | null> {
    try {
      if (!id || isNaN(id)) {
        throw new Error('Invalid job ID');
      }

      const job = await this.prisma.job.findUnique({
        where: {
          id: id
        },
        include: {
          company: true
        }
      });

      if (!job) {
        throw new Error('Job not found');
      }

      return job;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Fetch a specific job by its slug.
   * @param slug - The slug of the job.
   * @returns The job if found, or null if not.
   */
  public async getJobBySlug(slug: string): Promise<Job | null> {
    try {
      if (!slug) {
        throw new Error('Invalid job slug');
      }

      const job = await this.prisma.job.findUnique({
        where: {
          slug: slug
        },
        include: {
          company: true
        }
      });

      if (!job) {
        throw new Error('Job not found');
      }

      return job;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new job.
   * @param data - The data for the new job.
   * @returns The created job.
   */
  public async createJob(data: Prisma.JobCreateInput): Promise<Job> {
    try {
      return await this.prisma.job.create({
        data,
        include: {
          company: true,
        },
      });
    } catch (error) {
      console.error("Error creating job:", error);
      throw new Error("Unable to create job.");
    }
  }

  /**
   * Update an existing job by its ID.
   * @param id - The ID of the job to update.
   * @param data - The updated data for the job.
   * @returns The updated job.
   */
  public async updateJob(
    id: number,
    data: Partial<Prisma.JobUpdateInput>
  ): Promise<Job> {
    try {
      return await this.prisma.job.update({
        where: { id },
        data,
        include: { 
          company: true,
        },
      });
    } catch (error) {
      console.error(`Error updating job with ID ${id}:`, error);
      throw new Error("Unable to update job.");
    }
  }

  /**
   * Delete a job by its ID.
   * @param id - The ID of the job to delete.
   * @returns The deleted job.
   */
  public async deleteJob(id: number): Promise<Job> {
    try {
      return await this.prisma.job.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting job with ID ${id}:`, error);
      throw new Error("Unable to delete job.");
    }
  }
}

export default JobService;
