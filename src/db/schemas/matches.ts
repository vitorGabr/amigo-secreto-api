import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, uniqueIndex } from "drizzle-orm/pg-core";
import { events } from "./events";
import { users } from "./users";

export const matches = pgTable(
	"matches",
	{
		id: serial("id").primaryKey(),
		eventId: integer("eventId").notNull(),
		giverId: text("giverId").notNull(),
		receiverId: text("receiverId").notNull(),
	},
	(t) => [
		uniqueIndex("unique_event_giver_receiver").on(
			t.eventId,
			t.giverId,
			t.receiverId,
		),
	],
);

export const matchesRelations = relations(matches, (helpers) => ({
	event: helpers.one(events, {
		relationName: "EventToMatch",
		fields: [matches.eventId],
		references: [events.id],
	}),
	giver: helpers.one(users, {
		relationName: "Giver",
		fields: [matches.giverId],
		references: [users.id],
	}),
	receiver: helpers.one(users, {
		relationName: "Receiver",
		fields: [matches.receiverId],
		references: [users.id],
	}),
}));
