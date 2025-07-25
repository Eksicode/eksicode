/*
  Warnings:

  - You are about to drop the column `logo` on the `companies` table. All the data in the column will be lost.
  - You are about to drop the column `headerImg` on the `pages` table. All the data in the column will be lost.
  - You are about to drop the column `headerImage` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "logo",
ADD COLUMN     "logoId" INTEGER;

-- AlterTable
ALTER TABLE "pages" DROP COLUMN "headerImg",
ADD COLUMN     "headerImgId" INTEGER;

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "headerImage",
ADD COLUMN     "headerImageId" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "profilePicture",
ADD COLUMN     "profilePictureId" INTEGER;

-- CreateTable
CREATE TABLE "media" (
    "id" SERIAL NOT NULL,
    "originalName" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "altText" TEXT,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_filename_key" ON "media"("filename");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profilePictureId_fkey" FOREIGN KEY ("profilePictureId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_headerImageId_fkey" FOREIGN KEY ("headerImageId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pages" ADD CONSTRAINT "pages_headerImgId_fkey" FOREIGN KEY ("headerImgId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
