-- CreateTable
CREATE TABLE "FabricLibrary" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collection" TEXT,
    "colorFamily" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "composition" TEXT,
    "gsm" INTEGER,
    "width" INTEGER,
    "pricePerMeter" INTEGER NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "seamlessTextureUrl" TEXT NOT NULL,
    "normalMapUrl" TEXT,
    "roughnessMapUrl" TEXT,
    "textureScale" DOUBLE PRECISION DEFAULT 1.0,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FabricLibrary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualizerUpload" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "imageWidth" INTEGER NOT NULL,
    "imageHeight" INTEGER NOT NULL,
    "detectionModel" TEXT,
    "detectionData" JSONB NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisualizerUpload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualizerProject" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "uploadId" TEXT NOT NULL,
    "projectName" TEXT,
    "notes" TEXT,
    "detectionData" JSONB NOT NULL,
    "applications" JSONB NOT NULL,
    "maskEdits" JSONB,
    "compositeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisualizerProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualizerAlphaMask" (
    "id" TEXT NOT NULL,
    "uploadId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "maskUrl" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'png',
    "featherRadius" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisualizerAlphaMask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FabricLibraryToVisualizerProject" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FabricLibrary_code_key" ON "FabricLibrary"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_FabricLibraryToVisualizerProject_AB_unique" ON "_FabricLibraryToVisualizerProject"("A", "B");

-- CreateIndex
CREATE INDEX "_FabricLibraryToVisualizerProject_B_index" ON "_FabricLibraryToVisualizerProject"("B");

-- AddForeignKey
ALTER TABLE "VisualizerUpload" ADD CONSTRAINT "VisualizerUpload_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualizerProject" ADD CONSTRAINT "VisualizerProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FabricLibraryToVisualizerProject" ADD CONSTRAINT "_FabricLibraryToVisualizerProject_A_fkey" FOREIGN KEY ("A") REFERENCES "FabricLibrary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FabricLibraryToVisualizerProject" ADD CONSTRAINT "_FabricLibraryToVisualizerProject_B_fkey" FOREIGN KEY ("B") REFERENCES "VisualizerProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
