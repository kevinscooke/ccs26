-- AlterTable
ALTER TABLE "public"."Event" ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isRecurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSponsored" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parkingInfo" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "socialLinks" TEXT[];
