import { db } from "@/db/connection";
import { eventParticipants, users } from "@/db/schemas";
import { eq, type InferInsertModel } from "drizzle-orm";

export class UserRepository {
	async create(user: InferInsertModel<typeof users>) {
		return db.insert(users).values(user).onConflictDoNothing().execute();
	}

	async findByEmail(email: string) {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.execute();
		return user;
	}

	async findManyByEventParticipation(eventId: number) {
		return db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
			})
			.from(users)
			.innerJoin(eventParticipants, eq(eventParticipants.userId, users.id))
			.where(eq(eventParticipants.eventId, eventId))
			.execute();
	}

	async upsertMany(data: { email: string; name: string }[]) {
		return db
			.insert(users)
			.values(data)
			.onConflictDoNothing()
			.returning({
				id: users.id,
			})
			.execute();
	}
}

export const userRepository = new UserRepository();
