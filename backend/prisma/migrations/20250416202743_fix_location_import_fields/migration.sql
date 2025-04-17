/*
  Warnings:

  - You are about to drop the column `highlights` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `ImportLocation` table. All the data in the column will be lost.
  - You are about to drop the column `tips` on the `ImportLocation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ImportLocation" DROP COLUMN "highlights",
DROP COLUMN "location",
DROP COLUMN "tips",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "flag" TEXT;
