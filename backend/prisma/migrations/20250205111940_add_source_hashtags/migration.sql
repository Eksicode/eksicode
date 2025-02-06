/*
  Warnings:

  - You are about to drop the column `headers` on the `sources` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sources" DROP COLUMN "headers";

-- CreateTable
CREATE TABLE "_SourceHashTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SourceHashTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SourceHashTags_B_index" ON "_SourceHashTags"("B");

-- AddForeignKey
ALTER TABLE "_SourceHashTags" ADD CONSTRAINT "_SourceHashTags_A_fkey" FOREIGN KEY ("A") REFERENCES "hash_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SourceHashTags" ADD CONSTRAINT "_SourceHashTags_B_fkey" FOREIGN KEY ("B") REFERENCES "sources"("id") ON DELETE CASCADE ON UPDATE CASCADE;
