/*
  Warnings:

  - You are about to drop the column `company` on the `Jobs` table. All the data in the column will be lost.
  - You are about to drop the `Notfications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menuCategories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Sources` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Notfications" DROP CONSTRAINT "Notfications_id_fkey";

-- DropForeignKey
ALTER TABLE "Sources" DROP CONSTRAINT "Sources_id_fkey";

-- DropForeignKey
ALTER TABLE "menuCategories" DROP CONSTRAINT "menuCategories_menusId_fkey";

-- AlterTable
ALTER TABLE "Jobs" DROP COLUMN "company",
ADD COLUMN     "usersId" INTEGER;

-- AlterTable
ALTER TABLE "Sources" ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Notfications";

-- DropTable
DROP TABLE "menuCategories";

-- CreateTable
CREATE TABLE "MenuCategories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "menusId" INTEGER,

    CONSTRAINT "MenuCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notifications" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "NotificationTypes" NOT NULL,
    "userId" INTEGER NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MenuCategories_name_key" ON "MenuCategories"("name");

-- AddForeignKey
ALTER TABLE "MenuCategories" ADD CONSTRAINT "MenuCategories_menusId_fkey" FOREIGN KEY ("menusId") REFERENCES "Menus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jobs" ADD CONSTRAINT "Jobs_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sources" ADD CONSTRAINT "Sources_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
