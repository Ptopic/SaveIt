/*
  Warnings:

  - You are about to drop the `RecipeQuickTip` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecipeTip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecipeQuickTip" DROP CONSTRAINT "RecipeQuickTip_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "RecipeTip" DROP CONSTRAINT "RecipeTip_recipeId_fkey";

-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "tips" TEXT[];

-- DropTable
DROP TABLE "RecipeQuickTip";

-- DropTable
DROP TABLE "RecipeTip";
