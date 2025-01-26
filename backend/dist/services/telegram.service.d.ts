import { TelegramGroup, Prisma } from "@prisma/client";
declare class TelegramGroupsService {
    private prisma;
    constructor();
    /**
     * Fetch all telegram groups with pagination and optional summary view.
     * @param skip - Number of records to skip for pagination.
     * @param limit - Number of records to fetch.
     * @param summaryOnly - Whether to return a summarized view or detailed view.
     * @returns An object containing the list of telegram groups and the total count.
     */
    getAllTelegramGroups(skip: number, limit: number, summaryOnly: boolean): Promise<{
        telegrams: Partial<TelegramGroup>[];
        count: number;
    }>;
    /**
     * Fetch a specific telegram group by its ID.
     * @param id - The ID of the telegram group.
     * @returns The telegram group if found, or null if not.
     */
    getTelegramGroupById(id: number): Promise<TelegramGroup | null>;
    /**
     * Create a new telegram group.
     * @param data - The data for the new telegram group.
     * @returns The created telegram group.
     */
    createTelegramGroup(data: Prisma.TelegramGroupCreateInput): Promise<TelegramGroup>;
    /**
     * Update an existing telegram group by its ID.
     * @param id - The ID of the telegram group to update.
     * @param data - The updated data for the telegram group.
     * @returns The updated telegram group.
     */
    updateTelegramGroup(id: number, data: Partial<Prisma.TelegramGroupUpdateInput>): Promise<TelegramGroup>;
    /**
     * Delete a telegram group by its ID.
     * @param id - The ID of the telegram group to delete.
     * @returns The deleted telegram group.
     */
    deleteTelegramGroup(id: number): Promise<TelegramGroup>;
}
export default TelegramGroupsService;
