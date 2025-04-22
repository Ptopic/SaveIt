/*
  Warnings:

  - You are about to drop the column `address` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `bestTimeToVisit` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `emoji` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `flag` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `openingHours` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `reviewsAverage` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `reviewsCount` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `ImportLocation` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `ImportLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ImportLocation" DROP COLUMN "address",
DROP COLUMN "bestTimeToVisit",
DROP COLUMN "city",
DROP COLUMN "coordinates",
DROP COLUMN "country",
DROP COLUMN "description",
DROP COLUMN "emoji",
DROP COLUMN "flag",
DROP COLUMN "name",
DROP COLUMN "openingHours",
DROP COLUMN "phone",
DROP COLUMN "photo",
DROP COLUMN "reviewsAverage",
DROP COLUMN "reviewsCount",
DROP COLUMN "website",
ADD COLUMN     "locationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "city" TEXT,
    "country" TEXT,
    "flag" TEXT,
    "coordinates" TEXT,
    "emoji" TEXT,
    "address" TEXT,
    "bestTimeToVisit" TEXT,
    "description" TEXT,
    "openingHours" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "reviewsCount" INTEGER,
    "reviewsAverage" DOUBLE PRECISION,
    "photo" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportLocation" ADD CONSTRAINT "ImportLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
