import { relations } from "drizzle-orm";
import {
	doublePrecision,
	pgTable,
	serial,
	text,
	timestamp,
} from "drizzle-orm/pg-core";
import { eventParticipants } from "./event-participants";
import { matches } from "./matches";
import { users } from "./users";

export const events = pgTable("events", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	ownerId: text("ownerId").notNull(),
	exchangeDate: timestamp("exchange_date", { mode: "date", precision: 3 }),
	budget: doublePrecision("budget"),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const eventsRelations = relations(events, (helpers) => ({
	owner: helpers.one(users, {
		relationName: "EventOwner",
		fields: [events.ownerId],
		references: [users.id],
	}),
	participants: helpers.many(eventParticipants, {
		relationName: "EventToEventParticipant",
	}),
	matches: helpers.many(matches, { relationName: "EventToMatch" }),
}));
