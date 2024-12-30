import { PrismaClient, TelegramGroups, Prisma } from "@prisma/client";

class TelegramGroupsService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Fetch all telegram groups with pagination and optional summary view.
   * @param skip - Number of records to skip for pagination.
   * @param limit - Number of records to fetch.
   * @param summaryOnly - Whether to return a summarized view or detailed view.
   * @returns An object containing the list of telegram groups and the total count.
   */
  public async getAllTelegramGroups(
    skip: number,
    limit: number,
    summaryOnly: boolean
  ): Promise<{ telegrams: Partial<TelegramGroups>[]; count: number }> {
    const [telegrams, count] = await Promise.all([
      this.prisma.telegramGroups.findMany({
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
      this.prisma.telegramGroups.count(),
    ]);

    return { telegrams, count };
  }

  /**
   * Fetch a specific telegram group by its ID.
   * @param id - The ID of the telegram group.
   * @returns The telegram group if found, or null if not.
   */
  public async getTelegramGroupById(
    id: number
  ): Promise<TelegramGroups | null> {
    try {
      return await this.prisma.telegramGroups.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(`Error fetching telegram group with ID ${id}:`, error);
      throw new Error("Unable to fetch telegram group.");
    }
  }

  /**
   * Create a new telegram group.
   * @param data - The data for the new telegram group.
   * @returns The created telegram group.
   */
  public async createTelegramGroup(
    data: Prisma.TelegramGroupsCreateInput
  ): Promise<TelegramGroups> {
    try {
      return await this.prisma.telegramGroups.create({ data });
    } catch (error) {
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
  public async updateTelegramGroup(
    id: number,
    data: Partial<Prisma.TelegramGroupsUpdateInput>
  ): Promise<TelegramGroups> {
    try {
      return await this.prisma.telegramGroups.update({
        where: { id },
        data,
      });
    } catch (error) {
      console.error(`Error updating telegram group with ID ${id}:`, error);
      throw new Error("Unable to update telegram group.");
    }
  }

  /**
   * Delete a telegram group by its ID.
   * @param id - The ID of the telegram group to delete.
   * @returns The deleted telegram group.
   */
  public async deleteTelegramGroup(id: number): Promise<TelegramGroups> {
    try {
      return await this.prisma.telegramGroups.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting telegram group with ID ${id}:`, error);
      throw new Error("Unable to delete telegram group.");
    }
  }
}

export default TelegramGroupsService;
