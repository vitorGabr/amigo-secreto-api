import { db } from "@/db/connection";
import { authLinks } from "@/db/schemas";
import { eq, type InferInsertModel } from "drizzle-orm";

export class AuthLinkRepository {
	async create(data: InferInsertModel<typeof authLinks>) {
		return db.insert(authLinks).values(data).returning();
	}

	async findByCode(code: string) {
		const [data] = await db
			.select()
			.from(authLinks)
			.where(eq(authLinks.code, code));
		return data;
	}

	async delete(id: number) {
		return db.delete(authLinks).where(eq(authLinks.id, id));
	}
}

export const authLinkRepository = new AuthLinkRepository();
