/*
  Warnings:

  - You are about to drop the column `background` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImportLocationCategory" DROP CONSTRAINT "ImportLocationCategory_importLocationId_fkey";

-- DropForeignKey
ALTER TABLE "ImportLocationHighlight" DROP CONSTRAINT "ImportLocationHighlight_importLocationId_fkey";

-- DropForeignKey
ALTER TABLE "ImportLocationMustTryDish" DROP CONSTRAINT "ImportLocationMustTryDish_importLocationId_fkey";

-- DropForeignKey
ALTER TABLE "ImportLocationTip" DROP CONSTRAINT "ImportLocationTip_importLocationId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "background";

-- AddForeignKey
ALTER TABLE "ImportLocationTip" ADD CONSTRAINT "ImportLocationTip_importLocationId_fkey" FOREIGN KEY ("importLocationId") REFERENCES "ImportLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLocationHighlight" ADD CONSTRAINT "ImportLocationHighlight_importLocationId_fkey" FOREIGN KEY ("importLocationId") REFERENCES "ImportLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLocationCategory" ADD CONSTRAINT "ImportLocationCategory_importLocationId_fkey" FOREIGN KEY ("importLocationId") REFERENCES "ImportLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLocationMustTryDish" ADD CONSTRAINT "ImportLocationMustTryDish_importLocationId_fkey" FOREIGN KEY ("importLocationId") REFERENCES "ImportLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
