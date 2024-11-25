import { db } from "@/db/connection";
import { eventParticipants } from "@/db/schemas";
import type { InferInsertModel } from "drizzle-orm";

export class EventParticipantsRepository {
	async createMany(data: InferInsertModel<typeof eventParticipants>[]) {
		return db.insert(eventParticipants).values(data).returning();
	}
}

export const eventParticipantsRepository = new EventParticipantsRepository();
