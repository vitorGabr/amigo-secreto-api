import { relations } from "drizzle-orm";
import {
	integer,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { users } from "./users";

export const eventParticipants = pgTable(
	"event_participants",
	{
		id: serial("id").primaryKey(),
		eventId: integer("eventId").notNull(),
		userId: text("userId").notNull(),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
	},
	(table) => [uniqueIndex("unique_event_user").on(table.eventId, table.userId)],
);

export const eventParticipantsRelations = relations(
	eventParticipants,
	(helpers) => ({
		event: helpers.one(events, {
			relationName: "EventToEventParticipant",
			fields: [eventParticipants.eventId],
			references: [events.id],
		}),
		user: helpers.one(users, {
			relationName: "EventParticipantToUser",
			fields: [eventParticipants.userId],
			references: [users.id],
		}),
	}),
);
