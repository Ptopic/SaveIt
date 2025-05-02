/*
  Warnings:

  - You are about to drop the column `name` on the `RecipeIngredient` table. All the data in the column will be lost.
  - Added the required column `ingredient` to the `RecipeIngredient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecipeIngredient" DROP COLUMN "name",
ADD COLUMN     "ingredient" TEXT NOT NULL;
