/*
  Warnings:

  - A unique constraint covering the columns `[name,address1,city,state,postal]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "seriesId" TEXT;

-- CreateTable
CREATE TABLE "Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slugBase" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "venueId" TEXT,
    "description" TEXT,
    "timeZone" TEXT NOT NULL DEFAULT 'America/New_York',
    "startHour" INTEGER NOT NULL DEFAULT 9,
    "startMinute" INTEGER NOT NULL DEFAULT 0,
    "durationMin" INTEGER NOT NULL DEFAULT 180,
    "rrule" TEXT NOT NULL,
    "generateHorizonMonths" INTEGER NOT NULL DEFAULT 6,
    "lastGeneratedThrough" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Series_slugBase_key" ON "Series"("slugBase");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_name_address1_city_state_postal_key" ON "Venue"("name", "address1", "city", "state", "postal");

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Series" ADD CONSTRAINT "Series_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "Series"("id") ON DELETE SET NULL ON UPDATE CASCADE;
