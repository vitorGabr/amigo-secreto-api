import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { eventRepository } from "@/repositories/event";
import { eventParticipantsRepository } from "@/repositories/event-participants";
import { userRepository } from "@/repositories/user";
import type { Prisma } from "@prisma/client";

class EventParticipants {
    async update(data: {
		eventId: number;
		ownerId: string;
		participants: Prisma.UserCreateInput[];
	}) {

		const [event, participantsResult] = await Promise.all([
			eventRepository.get(data.eventId, data.ownerId),
			userRepository.upsertMany(data.participants),
		])
		if (!event) throw new UnauthorizedError();
		await eventParticipantsRepository.createMany(
			participantsResult.map((participant) => {
				return {
					eventId: event.id,
					userId: participant.id,
				};
			}),
		);
		return { participants: participantsResult };
	}
}

export const eventParticipantsUseCase = new EventParticipants();