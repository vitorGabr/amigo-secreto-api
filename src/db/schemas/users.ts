import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { events } from "./events";
import { eventParticipants } from "./event-participants";
import { matches } from "./matches";
import { authLinks } from "./auth-links";
import { createId } from "@paralleldrive/cuid2";

export const users = pgTable("users", {
	id: text("id")
		.$defaultFn(() => createId())
		.primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, (helpers) => ({
	eventsCreated: helpers.many(events, { relationName: "EventOwner" }),
	eventParticipations: helpers.many(eventParticipants, {
		relationName: "EventParticipantToUser",
	}),
	sentMatches: helpers.many(matches, { relationName: "Giver" }),
	receivedMatches: helpers.many(matches, { relationName: "Receiver" }),
	authLinks: helpers.many(authLinks, { relationName: "AuthLinkToUser" }),
}));
