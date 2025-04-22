/*
  Warnings:

  - You are about to drop the column `name` on the `ImportLocationMustTryDish` table. All the data in the column will be lost.
  - Added the required column `dish` to the `ImportLocationMustTryDish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImportLocationMustTryDish" DROP COLUMN "name",
ADD COLUMN     "dish" TEXT NOT NULL;
