/*
  Warnings:

  - You are about to drop the column `reviews_average` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `reviews_count` on the `ImportLocation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ImportLocation" DROP COLUMN "reviews_average",
DROP COLUMN "reviews_count",
ADD COLUMN     "reviewsAverage" DOUBLE PRECISION,
ADD COLUMN     "reviewsCount" INTEGER;
