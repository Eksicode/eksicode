import { PrismaClient, Company, Prisma } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import MediaService, { MediaUpload } from './media.service';

class CompanyService {
  private prisma: PrismaClient;
  private mediaService: MediaService;

  constructor(prisma?: PrismaClient, mediaService?: MediaService) {
    this.prisma = prisma || new PrismaClient();
    this.mediaService = mediaService || new MediaService(this.prisma);
  }

  /**
   * Fetch all companies with pagination and optional summary view.
   * @param skip - Number of records to skip for pagination.
   * @param limit - Number of records to fetch.
   * @param summaryOnly - Whether to return a summarized view or detailed view.
   * @returns An object containing the list of companies and the total count.
   */
  public async getAllCompanies(
    skip: number,
    limit: number,
    summaryOnly: boolean
  ): Promise<{ companies: Partial<Company>[]; count: number }> {
    const [companies, count] = await Promise.all([
      this.prisma.company.findMany({
        skip,
        take: limit,
        select: summaryOnly
          ? {
              id: true,
              name: true,
              industry: true,
              location: true,
              logo: {
                select: {
                  id: true,
                  url: true,
                  altText: true,
                }
              },
            }
          : {
              id: true,
              name: true,
              description: true,
              website: true,
              industry: true,
              location: true,
              logo: {
                select: {
                  id: true,
                  url: true,
                  altText: true,
                  type: true,
                }
              },
              hrpage: true,
              hrfields: true,
              jobs: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  location: true,
                  employmentType: true,
                  createdAt: true,
                }
              },
              createdAt: true,
              updatedAt: true,
            },
        orderBy: { name: 'asc' }
      }),
      this.prisma.company.count(),
    ]);

    return { companies, count };
  }

  /**
   * Fetch a specific company by its ID.
   * @param id - The ID of the company.
   * @returns The company if found, or null if not.
   */
  public async getCompanyById(id: number): Promise<Company | null> {
    try {
      return await this.prisma.company.findUnique({
        where: { id },
        include: {
          logo: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          jobs: {
            select: {
              id: true,
              title: true,
              slug: true,
              location: true,
              employmentType: true,
              salary: true,
              validAt: true,
              createdAt: true,
              updatedAt: true,
            },
            orderBy: { createdAt: 'desc' }
          }
        },
      });
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      throw new HttpException(500, "Unable to fetch company.");
    }
  }

  /**
   * Search companies by name or industry
   * @param term - The search term to look for in company name or industry.
   * @param skip - Number of records to skip for pagination.
   * @param limit - Number of records to fetch.
   * @returns An object containing the list of companies and the total count.
   */
  public async searchCompanies(
    term: string,
    skip: number = 0,
    limit: number = 10
  ): Promise<{ companies: Company[]; count: number }> {
    try {
      const whereClause = {
        OR: [
          {
            name: {
              contains: term,
              mode: "insensitive" as const,
            },
          },
          {
            industry: {
              contains: term,
              mode: "insensitive" as const,
            },
          },
          {
            location: {
              contains: term,
              mode: "insensitive" as const,
            },
          },
        ],
      };

      const [companies, count] = await Promise.all([
        this.prisma.company.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            logo: {
              select: {
                id: true,
                url: true,
                altText: true,
                type: true,
              }
            },
            jobs: {
              select: {
                id: true,
                title: true,
                slug: true,
                location: true,
                employmentType: true,
                createdAt: true,
              },
              take: 5, // Limit jobs in search results
              orderBy: { createdAt: 'desc' }
            }
          },
          orderBy: { name: 'asc' }
        }),
        this.prisma.company.count({ where: whereClause })
      ]);

      return { companies, count };
    } catch (error) {
      console.error("Error searching companies:", error);
      throw new HttpException(500, "Error searching companies");
    }
  }

  /**
   * Create a new company.
   * @param data - The data for the new company.
   * @returns The created company.
   */
  public async createCompany(data: Prisma.CompanyCreateInput): Promise<Company> {
    try {
      return await this.prisma.company.create({
        data,
        include: {
          logo: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          jobs: true,
        }
      });
    } catch (error) {
      console.error("Error creating company:", error);
      throw new HttpException(500, "Unable to create company.");
    }
  }

  /**
   * Update an existing company by its ID.
   * @param id - The ID of the company to update.
   * @param data - The updated data for the company.
   * @returns The updated company.
   */
  public async updateCompany(
    id: number,
    data: Partial<Prisma.CompanyUpdateInput>
  ): Promise<Company> {
    try {
      const existingCompany = await this.getCompanyById(id);
      if (!existingCompany) {
        throw new HttpException(404, 'Company not found');
      }

      return await this.prisma.company.update({
        where: { id },
        data,
        include: {
          logo: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          jobs: true,
        }
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(`Error updating company with ID ${id}:`, error);
      throw new HttpException(500, "Unable to update company.");
    }
  }

  /**
   * Update company logo
   */
  public async updateCompanyLogo(companyId: number, file: MediaUpload): Promise<Company> {
    try {
      // Verify company exists
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        select: { logoId: true }
      });

      if (!company) {
        throw new HttpException(404, 'Company not found');
      }

      // Upload new media
      const media = await this.mediaService.uploadMedia(file);

      // Update company with new logo
      const updatedCompany = await this.prisma.company.update({
        where: { id: companyId },
        data: { logoId: media.id },
        include: {
          logo: true,
          jobs: true,
        }
      });

      // Clean up old logo if it exists
      if (company.logoId) {
        try {
          await this.mediaService.deleteMedia(company.logoId);
        } catch (error) {
          console.warn(`Failed to delete old company logo ${company.logoId}:`, error);
          // Don't throw error as the main operation succeeded
        }
      }

      return updatedCompany;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to update company logo', { originalError: error });
    }
  }

  /**
   * Remove company logo
   */
  public async removeCompanyLogo(companyId: number): Promise<Company> {
    try {
      // Verify company exists
      const company = await this.prisma.company.findUnique({
        where: { id: companyId },
        select: { logoId: true }
      });

      if (!company) {
        throw new HttpException(404, 'Company not found');
      }

      if (!company.logoId) {
        throw new HttpException(400, 'Company has no logo to remove');
      }

      // Update company to remove logo
      const updatedCompany = await this.prisma.company.update({
        where: { id: companyId },
        data: { logoId: null },
        include: {
          jobs: true,
        }
      });

      // Delete the media file
      try {
        await this.mediaService.deleteMedia(company.logoId);
      } catch (error) {
        console.warn(`Failed to delete company logo ${company.logoId}:`, error);
        // Don't throw error as the main operation succeeded
      }

      return updatedCompany;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to remove company logo', { originalError: error });
    }
  }

  /**
   * Delete a company by its ID.
   * @param id - The ID of the company to delete.
   * @returns The deleted company.
   */
  public async deleteCompany(id: number): Promise<Company> {
    try {
      // Get company with logo info before deletion
      const company = await this.prisma.company.findUnique({
        where: { id },
        select: { logoId: true }
      });

      if (!company) {
        throw new HttpException(404, 'Company not found');
      }

      // Check if company has associated jobs
      const jobCount = await this.prisma.job.count({
        where: { companyId: id }
      });

      if (jobCount > 0) {
        throw new HttpException(400, `Cannot delete company. It has ${jobCount} associated job(s). Please delete or reassign the jobs first.`);
      }

      // Delete the company
      const deletedCompany = await this.prisma.company.delete({
        where: { id },
      });

      // Clean up logo if it exists
      if (company.logoId) {
        try {
          await this.mediaService.deleteMedia(company.logoId);
        } catch (error) {
          console.warn(`Failed to delete company logo ${company.logoId}:`, error);
          // Don't throw error as the main operation succeeded
        }
      }

      return deletedCompany;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error(`Error deleting company with ID ${id}:`, error);
      throw new HttpException(500, "Unable to delete company.");
    }
  }
}

export default CompanyService; 