import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

class EventParticipationRepository {
	async createMany(data: Prisma.EventParticipantCreateManyInput[]) {
		return prisma.eventParticipant.createMany({
			data: data,
		});
	}
}

export const eventParticipationRepository = new EventParticipationRepository();
