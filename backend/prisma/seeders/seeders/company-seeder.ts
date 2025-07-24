import { Prisma, JobType } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";
import { companiesData } from "../datas/companiesData";

/**
 * Seeder for companies
 */
export class CompanySeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${companiesData.length} companies...`);

    const companies = await this.processBatch(
      companiesData,
      async (company: any, tx) => {
        const { id, ...companyData } = company;
        return await this.safeUpsert(
          () => tx.company.upsert({
            where: { id: id },
            update: companyData,
            create: {
              id,
              ...companyData,
            },
          }),
          'company',
          company.name || `ID:${id}`
        );
      },
      SEED_CONFIG.batchSizes.companies,
      tx
    );

    this.logger.success(`Created/updated ${companies.length} companies`);
  }
}
