/*
  Warnings:

  - Added the required column `link` to the `TelegramGroups` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TelegramGroups" ADD COLUMN     "link" TEXT NOT NULL;
