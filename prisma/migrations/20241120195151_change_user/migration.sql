/*
  Warnings:

  - You are about to drop the column `participantId` on the `event_participants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId,userId]` on the table `event_participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `event_participants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_participants" DROP CONSTRAINT "event_participants_participantId_fkey";

-- DropIndex
DROP INDEX "event_participants_eventId_participantId_key";

-- AlterTable
ALTER TABLE "event_participants" DROP COLUMN "participantId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "auth_links" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_participants_eventId_userId_key" ON "event_participants"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "auth_links" ADD CONSTRAINT "auth_links_userId_fkey" FOREIGN KEY ("userId") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
