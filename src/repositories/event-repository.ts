import { db } from "@/db/connection";
import { events, users } from "@/db/schemas";
import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { type InferInsertModel, and, eq } from "drizzle-orm";

export class EventRepository {
	async get(eventId: number, userId: string) {
		const [event] = await db
			.select({
				id: events.id,
				name: events.name,
				budget: events.budget,
				exchangeDate: events.exchangeDate,
				description: events.description,
				ownerId: events.ownerId,
				owner: {
					name: users.name,
				},
			})
			.from(events)
			.innerJoin(users, eq(users.id, userId))
			.where(and(eq(events.id, eventId), eq(events.ownerId, userId)));

		if (!event) throw new UnauthorizedError();

		return event;
	}

	async create(data: InferInsertModel<typeof events>) {
		const [event] = await db.insert(events).values(data).returning();
		return event;
	}

	async findFirst(data: { id: number; ownerId: string }) {
		const [event] = await db
			.select({ id: events.id })
			.from(events)
			.where(and(eq(events.id, data.id), eq(events.ownerId, data.ownerId)));
		return event;
	}

	async update(
		id: number,
		data: {
			name?: string;
			exchangeDate?: Date;
			budget?: number;
			description?: string;
		},
	) {
		return db.update(events).set(data).where(eq(events.id, id)).returning();
	}

	async delete(eventId: number) {
		return db.delete(events).where(eq(events.id, eventId)).returning();
	}
}

export const eventRepository = new EventRepository();
