/*
  Warnings:

  - You are about to drop the column `tips` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "tips";

-- CreateTable
CREATE TABLE "RecipeTip" (
    "id" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeTip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeTip" ADD CONSTRAINT "RecipeTip_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
