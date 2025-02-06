/*
  Warnings:

  - You are about to drop the column `Department` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `EmploymentType` on the `jobs` table. All the data in the column will be lost.
  - Added the required column `department` to the `jobs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentType` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "Department",
DROP COLUMN "EmploymentType",
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "employmentType" TEXT NOT NULL;

-- DropEnum
DROP TYPE "JobEmploymentTypeEnum";
