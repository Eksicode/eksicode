-- AlterTable
ALTER TABLE "sources" ADD COLUMN     "groupName" VARCHAR(255),
ADD COLUMN     "tgUsername" VARCHAR(255);

-- CreateIndex
CREATE INDEX "sources_tgUser_idx" ON "sources"("tgUser");
