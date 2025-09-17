/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Series` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Series` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Series` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Series" DROP COLUMN "createdAt",
DROP COLUMN "description",
DROP COLUMN "updatedAt",
ALTER COLUMN "startHour" SET DEFAULT 8,
ALTER COLUMN "durationMin" SET DEFAULT 240;

-- CreateTable
CREATE TABLE "SeriesException" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeriesException_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeriesException_seriesId_idx" ON "SeriesException"("seriesId");

-- CreateIndex
CREATE UNIQUE INDEX "SeriesException_seriesId_date_key" ON "SeriesException"("seriesId", "date");

-- AddForeignKey
ALTER TABLE "SeriesException" ADD CONSTRAINT "SeriesException_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
