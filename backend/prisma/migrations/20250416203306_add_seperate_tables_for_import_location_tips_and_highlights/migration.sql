-- CreateTable
CREATE TABLE "ImportLocationTip" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tip" TEXT NOT NULL,
    "importLocationId" TEXT NOT NULL,

    CONSTRAINT "ImportLocationTip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportLocationHighlight" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "highlight" TEXT NOT NULL,
    "importLocationId" TEXT NOT NULL,

    CONSTRAINT "ImportLocationHighlight_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImportLocationTip" ADD CONSTRAINT "ImportLocationTip_importLocationId_fkey" FOREIGN KEY ("importLocationId") REFERENCES "ImportLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportLocationHighlight" ADD CONSTRAINT "ImportLocationHighlight_importLocationId_fkey" FOREIGN KEY ("importLocationId") REFERENCES "ImportLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
