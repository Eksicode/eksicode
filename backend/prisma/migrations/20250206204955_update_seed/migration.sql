/*
  Warnings:

  - The primary key for the `companies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `jobs` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_companyId_fkey";

-- AlterTable
ALTER TABLE "companies" DROP CONSTRAINT "companies_pkey",
DROP COLUMN "id",
ADD COLUMN     "companyId" SERIAL NOT NULL,
ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("companyId");

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "companyId";

-- CreateTable
CREATE TABLE "_CompanyToJob" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompanyToJob_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CompanyToJob_B_index" ON "_CompanyToJob"("B");

-- AddForeignKey
ALTER TABLE "_CompanyToJob" ADD CONSTRAINT "_CompanyToJob_A_fkey" FOREIGN KEY ("A") REFERENCES "companies"("companyId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyToJob" ADD CONSTRAINT "_CompanyToJob_B_fkey" FOREIGN KEY ("B") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
