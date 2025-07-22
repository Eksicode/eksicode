import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { telegramGroupsData } from "../../telegramGroupsData";

/**
 * Seeder for telegram groups
 */
export class TelegramSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${telegramGroupsData.length} telegram groups...`);

    const groups = await this.processBatch(
      telegramGroupsData,
      async (group: any, tx) => {
        const { channel_id, list_order, logo, ...groupData } = group;
        
        const transformedData = {
          ...groupData,
          channelId: channel_id,
          listOrder: list_order,
          icon: logo,
        };

        return await this.safeUpsert(
          () => tx.telegramGroup.upsert({
            where: { name: group.name },
            update: transformedData,
            create: transformedData,
          }),
          'telegram group',
          group.name
        );
      },
      20,
      tx
    );

    this.logger.success(`Created/updated ${groups.length} telegram groups`);
  }
}
