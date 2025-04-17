/*
  Warnings:

  - You are about to drop the column `address` on the `Import` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Import` table. All the data in the column will be lost.
  - You are about to drop the column `summary` on the `Import` table. All the data in the column will be lost.
  - You are about to drop the column `importId` on the `ImportLocation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[placeId]` on the table `ImportLocation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `placeId` to the `ImportLocation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImportLocation" DROP CONSTRAINT "ImportLocation_importId_fkey";

-- AlterTable
ALTER TABLE "Import" DROP COLUMN "address",
DROP COLUMN "location",
DROP COLUMN "summary";

-- AlterTable
ALTER TABLE "ImportLocation" DROP COLUMN "importId",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "indoor_seating" TEXT,
ADD COLUMN     "outdoor_seating" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "placeId" TEXT NOT NULL,
ADD COLUMN     "website" TEXT,
ADD COLUMN     "wheelchair" TEXT;

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "emoji" TEXT,
    "importId" TEXT NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImportLocation_placeId_key" ON "ImportLocation"("placeId");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLocation" ADD CONSTRAINT "ImportLocation_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
