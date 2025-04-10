-- AlterTable
ALTER TABLE "Import" ADD COLUMN     "socialMediaType" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'processing';
