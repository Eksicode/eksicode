/*
  Warnings:

  - You are about to drop the `MediaLibrary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pages" DROP CONSTRAINT "Pages_id_fkey";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_id_fkey";

-- DropForeignKey
ALTER TABLE "TelegramGroups" DROP CONSTRAINT "TelegramGroups_id_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_id_fkey";

-- AlterTable
ALTER TABLE "Pages" ADD COLUMN     "headerImg" TEXT;

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "headerImage" TEXT;

-- AlterTable
ALTER TABLE "TelegramGroups" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "website" TEXT;

-- DropTable
DROP TABLE "MediaLibrary";
