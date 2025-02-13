/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `jobs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "jobs_slug_key" ON "jobs"("slug");
