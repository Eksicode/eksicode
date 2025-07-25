import { PrismaClient, Page, Prisma } from "@prisma/client";
import { HttpException } from "../exceptions/HttpException";
import MediaService, { MediaUpload } from './media.service';

class PageService {
  private prisma: PrismaClient;
  private mediaService: MediaService;

  constructor(prisma?: PrismaClient, mediaService?: MediaService) {
    this.prisma = prisma || new PrismaClient();
    this.mediaService = mediaService || new MediaService(this.prisma);
  }

  /**
   * Fetch all page with pagination and optional summary view.
   * @param skip - Number of records to skip for pagination.
   * @param limit - Number of records to fetch.
   * @param summaryOnly - Whether to return a summarized view or detailed view.
   * @returns An object containing the list of page and the total count.
   */
  public async getAllPages(
    skip: number,
    limit: number,
    summaryOnly: boolean
  ): Promise<{ pages: Partial<Page>[]; count: number }> {
    const [pages, count] = await Promise.all([
      this.prisma.page.findMany({
        skip,
        take: limit,
        select: summaryOnly
          ? {
              id: true,
              title: true,
              slug: true,
            }
          : {
              id: true,
              title: true,
              content: true,
              headerImg: {
                select: {
                  id: true,
                  url: true,
                  altText: true,
                  type: true,
                }
              },
              slug: true,
              categories: true,
              createdAt: true,
              updatedAt: true,
            },
      }),
      this.prisma.page.count(),
    ]);

    return { pages, count };
  }

  /**
   * Fetch a specific page by its Slug.
   * @param slug - The Slug of the page.
   * @returns The page if found, or null if not.
   */
  public async getPageBySlug(slug: string): Promise<Page | null> {
    try {
      return await this.prisma.page.findUnique({
        where: { slug },
        include: {
          headerImg: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          categories: true,
        },
      });
    } catch (error) {
      console.error(`Error fetching page with slug ${slug}:`, error);
      throw new Error("Unable to fetch pages.");
    }
  }

  /**
   * Update page header image
   */
  public async updatePageHeaderImage(pageId: number, file: MediaUpload): Promise<Page> {
    try {
      // Verify page exists
      const page = await this.prisma.page.findUnique({
        where: { id: pageId },
        select: { headerImgId: true }
      });

      if (!page) {
        throw new HttpException(404, 'Page not found');
      }

      // Upload new media
      const media = await this.mediaService.uploadMedia(file);

      // Update page with new header image
      const updatedPage = await this.prisma.page.update({
        where: { id: pageId },
        data: { headerImgId: media.id },
        include: {
          headerImg: true,
          categories: true,
        }
      });

      // Clean up old header image if it exists
      if (page.headerImgId) {
        try {
          await this.mediaService.deleteMedia(page.headerImgId);
        } catch (error) {
          console.warn(`Failed to delete old header image ${page.headerImgId}:`, error);
          // Don't throw error as the main operation succeeded
        }
      }

      return updatedPage;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to update page header image', { originalError: error });
    }
  }

  /**
   * Remove page header image
   */
  public async removePageHeaderImage(pageId: number): Promise<Page> {
    try {
      // Verify page exists
      const page = await this.prisma.page.findUnique({
        where: { id: pageId },
        select: { headerImgId: true }
      });

      if (!page) {
        throw new HttpException(404, 'Page not found');
      }

      if (!page.headerImgId) {
        throw new HttpException(400, 'Page has no header image to remove');
      }

      // Update page to remove header image
      const updatedPage = await this.prisma.page.update({
        where: { id: pageId },
        data: { headerImgId: null },
        include: {
          categories: true,
        }
      });

      // Delete the media file
      try {
        await this.mediaService.deleteMedia(page.headerImgId);
      } catch (error) {
        console.warn(`Failed to delete header image ${page.headerImgId}:`, error);
        // Don't throw error as the main operation succeeded
      }

      return updatedPage;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(500, 'Failed to remove page header image', { originalError: error });
    }
  }

  /**
   * Create a new page.
   * @param data - The data for the new page.
   * @returns The created page.
   */
  public async createPage(data: Prisma.PageCreateInput): Promise<Page> {
    try {
      return await this.prisma.page.create({ 
        data,
        include: {
          headerImg: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          categories: true,
        }
      });
    } catch (error) {
      console.error("Error creating page:", error);
      throw new Error("Unable to create page.");
    }
  }

  /**
   * Update an existing page by its ID.
   * @param id - The ID of the page to update.
   * @param data - The updated data for the page.
   * @returns The updated page.
   */
  public async updatePage(
    id: number,
    data: Partial<Prisma.PageUpdateInput>
  ): Promise<Page> {
    try {
      return await this.prisma.page.update({
        where: { id },
        data,
        include: {
          headerImg: {
            select: {
              id: true,
              url: true,
              altText: true,
              type: true,
            }
          },
          categories: true,
        }
      });
    } catch (error) {
      console.error(`Error updating page with ID ${id}:`, error);
      throw new Error("Unable to update page.");
    }
  }

  /**
   * Delete a page by its ID.
   * @param id - The ID of the page to delete.
   * @returns The deleted page.
   */
  public async deletePage(id: number): Promise<Page> {
    try {
      // Get page with header image info before deletion
      const page = await this.prisma.page.findUnique({
        where: { id },
        select: { headerImgId: true }
      });

      // Delete the page
      const deletedPage = await this.prisma.page.delete({
        where: { id },
      });

      // Clean up header image if it exists
      if (page?.headerImgId) {
        try {
          await this.mediaService.deleteMedia(page.headerImgId);
        } catch (error) {
          console.warn(`Failed to delete header image ${page.headerImgId}:`, error);
          // Don't throw error as the main operation succeeded
        }
      }

      return deletedPage;
    } catch (error) {
      console.error(`Error deleting page with ID ${id}:`, error);
      throw new Error("Unable to delete page.");
    }
  }
}

export default PageService;
