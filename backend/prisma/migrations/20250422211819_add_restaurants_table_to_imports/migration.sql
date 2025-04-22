/*
  Warnings:

  - You are about to drop the column `placeId` on the `ImportLocation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[restaurantId]` on the table `ImportLocation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `restaurantId` to the `ImportLocation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImportLocation" DROP CONSTRAINT "ImportLocation_placeId_fkey";

-- DropIndex
DROP INDEX "ImportLocation_placeId_key";

-- AlterTable
ALTER TABLE "ImportLocation" DROP COLUMN "placeId",
ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "importLocationId" TEXT;

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "emoji" TEXT,
    "photo" TEXT,
    "importId" TEXT NOT NULL,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportLocationMustTryDish" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "importLocationId" TEXT NOT NULL,

    CONSTRAINT "ImportLocationMustTryDish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImportLocation_restaurantId_key" ON "ImportLocation"("restaurantId");

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_importLocationId_fkey" FOREIGN KEY ("importLocationId") REFERENCES "ImportLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLocation" ADD CONSTRAINT "ImportLocation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLocationMustTryDish" ADD CONSTRAINT "ImportLocationMustTryDish_importLocationId_fkey" FOREIGN KEY ("importLocationId") REFERENCES "ImportLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
