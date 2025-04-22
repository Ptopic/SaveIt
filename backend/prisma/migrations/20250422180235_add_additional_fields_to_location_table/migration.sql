/*
  Warnings:

  - You are about to drop the column `emoji` on the `Location` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Location" DROP COLUMN "emoji",
ADD COLUMN     "businessStatus" TEXT,
ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "locationLink" TEXT,
ADD COLUMN     "placeId" TEXT,
ADD COLUMN     "priceRange" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "typicalTimeSpent" TEXT;
