import { Prisma, JobType } from "@prisma/client";
import { BaseSeeder } from "./base-seeder";
import { SEED_CONFIG } from "../config/seed-config";
import { jobsData } from "../datas/jobsData";

/**
 * Seeder for jobs
 */
export class JobSeeder extends BaseSeeder {
  async seed(tx: Prisma.TransactionClient): Promise<void> {
    this.logger.info(`Seeding ${jobsData.length} jobs...`);

    const jobs = await this.processBatch(
      jobsData,
      async (job: any, tx) => {
        const { id, employmentType, company, validAt, ...jobData } = job;
        
        const jobInput = {
          ...jobData,
          employmentType: employmentType as JobType,
          createdAt: new Date(jobData.createdAt),
          updatedAt: new Date(jobData.updatedAt),
          validAt: validAt ? new Date(validAt) : null, // Handle the new validAt field
          companyId: company // Use companyId instead of company relation
        };

        return await this.safeUpsert(
          () => tx.job.upsert({
            where: { slug: jobData.slug }, // Use slug as unique identifier instead of id
            update: jobInput,
            create: jobInput // Don't include id in create
          }),
          'job',
          jobData.title || jobData.slug || `Company:${company}`
        );
      },
      SEED_CONFIG.batchSizes.jobs,
      tx
    );

    this.logger.success(`Created/updated ${jobs.length} jobs`);
  }
}
