-- DropForeignKey
ALTER TABLE "ImportLocation" DROP CONSTRAINT "ImportLocation_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_importLocationId_fkey";

-- DropIndex
DROP INDEX "ImportLocation_restaurantId_key";

-- AlterTable
ALTER TABLE "ImportLocation" ADD COLUMN     "placeId" TEXT,
ALTER COLUMN "restaurantId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "importLocationId" TEXT;

-- AddForeignKey
ALTER TABLE "ImportLocation" ADD CONSTRAINT "ImportLocation_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLocation" ADD CONSTRAINT "ImportLocation_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
