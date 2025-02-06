/*
  Warnings:

  - The primary key for the `companies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyId` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the `_CompanyToJob` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToJob" DROP CONSTRAINT "_CompanyToJob_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToJob" DROP CONSTRAINT "_CompanyToJob_B_fkey";

-- AlterTable
ALTER TABLE "companies" DROP CONSTRAINT "companies_pkey",
DROP COLUMN "companyId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "companyId" INTEGER NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "salary" DROP NOT NULL,
ALTER COLUMN "department" DROP NOT NULL,
ALTER COLUMN "employmentType" DROP NOT NULL;

-- DropTable
DROP TABLE "_CompanyToJob";

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
