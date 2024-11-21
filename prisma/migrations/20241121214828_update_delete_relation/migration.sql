-- DropForeignKey
ALTER TABLE "event_participants" DROP CONSTRAINT "event_participants_eventId_fkey";

-- DropForeignKey
ALTER TABLE "event_participants" DROP CONSTRAINT "event_participants_userId_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_giverId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_receiverId_fkey";

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_giverId_fkey" FOREIGN KEY ("giverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
