import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const authLinks = pgTable("auth_links", {
	id: serial("id").primaryKey(),
	userId: text("userId").notNull(),
	code: text("code").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date()),
});

export const authLinksRelations = relations(authLinks, (helpers) => ({
	user: helpers.one(users, {
		relationName: "AuthLinkToUser",
		fields: [authLinks.userId],
		references: [users.id],
	}),
}));
