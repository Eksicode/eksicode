"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class TelegramGroupsService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    /**
     * Fetch all telegram groups with pagination and optional summary view.
     * @param skip - Number of records to skip for pagination.
     * @param limit - Number of records to fetch.
     * @param summaryOnly - Whether to return a summarized view or detailed view.
     * @returns An object containing the list of telegram groups and the total count.
     */
    async getAllTelegramGroups(skip, limit, summaryOnly) {
        const [telegrams, count] = await Promise.all([
            this.prisma.telegramGroup.findMany({
                skip,
                take: limit,
                select: summaryOnly
                    ? {
                        id: true,
                        name: true,
                        icon: true,
                        link: true,
                    }
                    : {
                        id: true,
                        name: true,
                        icon: true,
                        members: true,
                        link: true,
                        channelId: true,
                        listOrder: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true,
                    },
            }),
            this.prisma.telegramGroup.count(),
        ]);
        return { telegrams, count };
    }
    /**
     * Fetch a specific telegram group by its ID.
     * @param id - The ID of the telegram group.
     * @returns The telegram group if found, or null if not.
     */
    async getTelegramGroupById(id) {
        try {
            return await this.prisma.telegramGroup.findUnique({
                where: { id },
            });
        }
        catch (error) {
            console.error(`Error fetching telegram group with ID ${id}:`, error);
            throw new Error("Unable to fetch telegram group.");
        }
    }
    /**
     * Create a new telegram group.
     * @param data - The data for the new telegram group.
     * @returns The created telegram group.
     */
    async createTelegramGroup(data) {
        try {
            return await this.prisma.telegramGroup.create({ data });
        }
        catch (error) {
            console.error("Error creating telegram group:", error);
            throw new Error("Unable to create telegram group.");
        }
    }
    /**
     * Update an existing telegram group by its ID.
     * @param id - The ID of the telegram group to update.
     * @param data - The updated data for the telegram group.
     * @returns The updated telegram group.
     */
    async updateTelegramGroup(id, data) {
        try {
            return await this.prisma.telegramGroup.update({
                where: { id },
                data,
            });
        }
        catch (error) {
            console.error(`Error updating telegram group with ID ${id}:`, error);
            throw new Error("Unable to update telegram group.");
        }
    }
    /**
     * Delete a telegram group by its ID.
     * @param id - The ID of the telegram group to delete.
     * @returns The deleted telegram group.
     */
    async deleteTelegramGroup(id) {
        try {
            return await this.prisma.telegramGroup.delete({
                where: { id },
            });
        }
        catch (error) {
            console.error(`Error deleting telegram group with ID ${id}:`, error);
            throw new Error("Unable to delete telegram group.");
        }
    }
}
exports.default = TelegramGroupsService;
//# sourceMappingURL=telegram.service.js.map