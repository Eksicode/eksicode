/*
  Warnings:

  - You are about to drop the column `commentsId` on the `TelegramGroups` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationTypes" AS ENUM ('yorum', 'gönderi', 'hata', 'yönetim', 'mesaj');

-- DropForeignKey
ALTER TABLE "TelegramGroups" DROP CONSTRAINT "TelegramGroups_commentsId_fkey";

-- AlterTable
ALTER TABLE "TelegramGroups" DROP COLUMN "commentsId";

-- CreateTable
CREATE TABLE "Notfications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NotificationTypes" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notfications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notfications" ADD CONSTRAINT "Notfications_id_fkey" FOREIGN KEY ("id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
