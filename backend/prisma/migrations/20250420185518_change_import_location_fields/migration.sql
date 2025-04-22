/*
  Warnings:

  - You are about to drop the column `email` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `indoor_seating` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `outdoor_seating` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `wheelchair` on the `ImportLocation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ImportLocation" DROP COLUMN "email",
DROP COLUMN "indoor_seating",
DROP COLUMN "outdoor_seating",
DROP COLUMN "wheelchair",
ADD COLUMN     "reviews_average" DOUBLE PRECISION,
ADD COLUMN     "reviews_count" INTEGER;
