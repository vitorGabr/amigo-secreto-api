import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export class EventParticipantsRepository {
	async createMany(data: Prisma.EventParticipantCreateManyInput[]) {
		return prisma.eventParticipant.createMany({
			data: data,
		});
	}
}

export const eventParticipantsRepository = new EventParticipantsRepository();
