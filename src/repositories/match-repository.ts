import { db } from "@/db/connection";
import { matches } from "@/db/schemas";
import type { InferInsertModel } from "drizzle-orm";

export class MatchRepository {
	async createMany(data: InferInsertModel<typeof matches>[]) {
		return db.insert(matches).values(data).onConflictDoNothing().returning();
	}
}
