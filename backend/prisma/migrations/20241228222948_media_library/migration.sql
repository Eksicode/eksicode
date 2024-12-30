/*
  Warnings:

  - You are about to drop the column `headerImg` on the `Pages` table. All the data in the column will be lost.
  - You are about to drop the column `headerImage` on the `Posts` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `TelegramGroups` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `TelegramGroups` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `Users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaTypes" AS ENUM ('image', 'video', 'audio', 'document');

-- AlterTable
ALTER TABLE "Pages" DROP COLUMN "headerImg";

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "headerImage";

-- AlterTable
ALTER TABLE "TelegramGroups" DROP COLUMN "icon",
DROP COLUMN "link",
ADD COLUMN     "commentsId" INTEGER;

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "profilePicture";

-- CreateTable
CREATE TABLE "MediaLibrary" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MediaTypes" NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaLibrary_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_id_fkey" FOREIGN KEY ("id") REFERENCES "MediaLibrary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_id_fkey" FOREIGN KEY ("id") REFERENCES "MediaLibrary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pages" ADD CONSTRAINT "Pages_id_fkey" FOREIGN KEY ("id") REFERENCES "MediaLibrary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramGroups" ADD CONSTRAINT "TelegramGroups_id_fkey" FOREIGN KEY ("id") REFERENCES "MediaLibrary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TelegramGroups" ADD CONSTRAINT "TelegramGroups_commentsId_fkey" FOREIGN KEY ("commentsId") REFERENCES "Comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
