import { PrismaClient, TelegramGroup, Prisma } from "@prisma/client";

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
  ): Promise<{ telegrams: Partial<TelegramGroup>[]; count: number }> {
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
  public async getTelegramGroupById(
    id: number
  ): Promise<TelegramGroup | null> {
    try {
      return await this.prisma.telegramGroup.findUnique({
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
    data: Prisma.TelegramGroupCreateInput
  ): Promise<TelegramGroup> {
    try {
      return await this.prisma.telegramGroup.create({ data });
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
    data: Partial<Prisma.TelegramGroupUpdateInput>
  ): Promise<TelegramGroup> {
    try {
      return await this.prisma.telegramGroup.update({
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
  public async deleteTelegramGroup(id: number): Promise<TelegramGroup> {
    try {
      return await this.prisma.telegramGroup.delete({
        where: { id },
      });
    } catch (error) {
      console.error(`Error deleting telegram group with ID ${id}:`, error);
      throw new Error("Unable to delete telegram group.");
    }
  }
}

export default TelegramGroupsService;
