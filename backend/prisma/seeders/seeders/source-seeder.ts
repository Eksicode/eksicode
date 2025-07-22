import { Prisma } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { sourcesData } from "../../sourcesData";

/**
 * Seeder for sources
 */
export class SourceSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${sourcesData.length} sources...`);

    const sources = await this.processBatch(
      sourcesData,
      async (source: any, tx) => {
        const { tags, ...sourceData } = source;

        return await this.safeUpsert(
          () => tx.source.upsert({
            where: { id: source.id },
            update: {
              ...sourceData,
              updatedAt: new Date(),
            },
            create: {
              ...sourceData,
              createdAt: new Date(),
            },
          }),
          'source',
          sourceData.name || `ID:${source.id}`
        );
      },
      25,
      tx
    );

    this.logger.success(`Created/updated ${sources.length} sources`);
  }
}
