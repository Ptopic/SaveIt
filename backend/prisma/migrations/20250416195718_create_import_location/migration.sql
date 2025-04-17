-- CreateTable
CREATE TABLE "ImportLocation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "coordinates" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "tips" TEXT NOT NULL,
    "highlights" TEXT NOT NULL,
    "bestTimeToVisit" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "importId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ImportLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportLocation" ADD CONSTRAINT "ImportLocation_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLocation" ADD CONSTRAINT "ImportLocation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
