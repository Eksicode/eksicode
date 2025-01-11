import { PrismaClient, Page, Prisma } from "@prisma/client";

class PageService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
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
              headerImg: true,
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
   * Fetch a specific page by its ID.
   * @param id - The ID of the page.
   * @returns The page if found, or null if not.
   */
  //   public async getPageById(id: number): Promise<Pages | null> {
  //     try {
  //       return await this.prisma.pages.findUnique({
  //         where: { id },
  //       });
  //     } catch (error) {
  //       console.error(`Error fetching page with ID ${id}:`, error);
  //       throw new Error("Unable to fetch pages.");
  //     }
  //   }

  /**
   * Fetch a specific page by its Slug.
   * @param id - The Slug of the page.
   * @returns The page if found, or null if not.
   */
  public async getPageBySlug(slug: string): Promise<Page | null> {
    try {
      return await this.prisma.page.findUnique({
        where: { slug },
      });
    } catch (error) {
      console.error(`Error fetching page with slug ${slug}:`, error);
      throw new Error("Unable to fetch pages.");
    }
  }

  /**
   * Create a new page.
   * @param data - The data for the new page.
   * @returns The created page.
   */
  public async createPage(data: Prisma.PageCreateInput): Promise<Page> {
    try {
      return await this.prisma.page.create({ data });
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
      return await this.prisma.page.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting page with ID ${id}:`, error);
      throw new Error("Unable to delete page.");
    }
  }
}

export default PageService;
