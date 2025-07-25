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
        const { id, logo, ...companyData } = company;
        
        // Handle logoId - for now set to null, can be updated later when media seeder is available
        const companyInput = {
          ...companyData,
          logoId: null, // Will be set when media seeder is implemented
        };

        return await this.safeUpsert(
          () => tx.company.upsert({
            where: { id: id },
            update: companyInput,
            create: {
              id,
              ...companyInput,
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
