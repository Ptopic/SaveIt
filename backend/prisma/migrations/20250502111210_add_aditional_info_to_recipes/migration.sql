/*
  Warnings:

  - You are about to drop the column `creatorInsights` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `didYouKnow` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `equipment` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `storage` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `substitutions` on the `Recipe` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "creatorInsights",
DROP COLUMN "didYouKnow",
DROP COLUMN "equipment",
DROP COLUMN "storage",
DROP COLUMN "substitutions";

-- CreateTable
CREATE TABLE "RecipeCreatorInsight" (
    "id" TEXT NOT NULL,
    "insight" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeCreatorInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeSubstitution" (
    "id" TEXT NOT NULL,
    "substitution" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeSubstitution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeEquipment" (
    "id" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeEquipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeStorage" (
    "id" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeStorage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeDidYouKnow" (
    "id" TEXT NOT NULL,
    "didYouKnow" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeDidYouKnow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RecipeCreatorInsight" ADD CONSTRAINT "RecipeCreatorInsight_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeSubstitution" ADD CONSTRAINT "RecipeSubstitution_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeEquipment" ADD CONSTRAINT "RecipeEquipment_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStorage" ADD CONSTRAINT "RecipeStorage_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeDidYouKnow" ADD CONSTRAINT "RecipeDidYouKnow_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
