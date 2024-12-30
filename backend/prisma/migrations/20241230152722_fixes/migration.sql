/*
  Warnings:

  - You are about to drop the column `menusId` on the `MenuCategories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Pages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Posts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `link` to the `Menus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Pages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MenuCategories" DROP CONSTRAINT "MenuCategories_menusId_fkey";

-- DropIndex
DROP INDEX "Menus_name_key";

-- AlterTable
ALTER TABLE "MenuCategories" DROP COLUMN "menusId";

-- AlterTable
ALTER TABLE "Menus" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "link" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pages" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Pages_slug_key" ON "Pages"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Posts_slug_key" ON "Posts"("slug");

-- AddForeignKey
ALTER TABLE "MenuCategories" ADD CONSTRAINT "MenuCategories_id_fkey" FOREIGN KEY ("id") REFERENCES "Menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
