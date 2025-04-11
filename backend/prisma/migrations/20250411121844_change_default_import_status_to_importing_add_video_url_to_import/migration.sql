-- AlterTable
ALTER TABLE "Import" ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Importing';
