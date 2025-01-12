-- DropForeignKey
ALTER TABLE "menu_categories" DROP CONSTRAINT "menu_categories_id_fkey";

-- CreateTable
CREATE TABLE "_MenuToMenuCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MenuToMenuCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MenuToMenuCategory_B_index" ON "_MenuToMenuCategory"("B");

-- AddForeignKey
ALTER TABLE "_MenuToMenuCategory" ADD CONSTRAINT "_MenuToMenuCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuToMenuCategory" ADD CONSTRAINT "_MenuToMenuCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "menu_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
