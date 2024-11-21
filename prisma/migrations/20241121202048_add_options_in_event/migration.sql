-- AlterTable
ALTER TABLE "events" ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "exchange_date" TIMESTAMP(3);
