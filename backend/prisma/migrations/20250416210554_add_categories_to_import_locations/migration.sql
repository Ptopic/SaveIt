-- CreateTable
CREATE TABLE "ImportLocationCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" TEXT NOT NULL,
    "importLocationId" TEXT NOT NULL,

    CONSTRAINT "ImportLocationCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportLocationCategory" ADD CONSTRAINT "ImportLocationCategory_importLocationId_fkey" FOREIGN KEY ("importLocationId") REFERENCES "ImportLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
