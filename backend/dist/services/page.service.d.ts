import { Page, Prisma } from "@prisma/client";
declare class PageService {
    private prisma;
    constructor();
    /**
     * Fetch all page with pagination and optional summary view.
     * @param skip - Number of records to skip for pagination.
     * @param limit - Number of records to fetch.
     * @param summaryOnly - Whether to return a summarized view or detailed view.
     * @returns An object containing the list of page and the total count.
     */
    getAllPages(skip: number, limit: number, summaryOnly: boolean): Promise<{
        pages: Partial<Page>[];
        count: number;
    }>;
    /**
     * Fetch a specific page by its ID.
     * @param id - The ID of the page.
     * @returns The page if found, or null if not.
     */
    /**
     * Fetch a specific page by its Slug.
     * @param id - The Slug of the page.
     * @returns The page if found, or null if not.
     */
    getPageBySlug(slug: string): Promise<Page | null>;
    /**
     * Create a new page.
     * @param data - The data for the new page.
     * @returns The created page.
     */
    createPage(data: Prisma.PageCreateInput): Promise<Page>;
    /**
     * Update an existing page by its ID.
     * @param id - The ID of the page to update.
     * @param data - The updated data for the page.
     * @returns The updated page.
     */
    updatePage(id: number, data: Partial<Prisma.PageUpdateInput>): Promise<Page>;
    /**
     * Delete a page by its ID.
     * @param id - The ID of the page to delete.
     * @returns The deleted page.
     */
    deletePage(id: number): Promise<Page>;
}
export default PageService;
