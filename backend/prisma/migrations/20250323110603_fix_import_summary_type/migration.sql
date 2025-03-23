/*
  Warnings:

  - The `summary` column on the `Import` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Import" DROP COLUMN "summary",
ADD COLUMN     "summary" JSONB;
