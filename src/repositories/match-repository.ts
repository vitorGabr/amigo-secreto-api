import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class MatchRepository {
	async createMany(data: Prisma.MatchCreateManyInput[]) {
		return prisma.match.createMany({
			data,
		});
	}
}
