import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { eventRepository } from "@/repositories/event";
import { eventParticipationRepository } from "@/repositories/event-participation";
import { userRepository } from "@/repositories/user";
import type { Prisma } from "@prisma/client";

class EventsUseCase {
	async createEvent(data: {
		event: { ownerId: string; name: string };
		participants: Prisma.UserCreateInput[];
	}) {
		const response = await eventRepository.create(data.event);
		const participantsResult = await userRepository.upsertMany(
			data.participants,
		);
		await eventParticipationRepository.createMany(
			participantsResult.map((participant) => {
				return {
					eventId: response.id,
					userId: participant.id,
				};
			}),
		);
		return { participants: participantsResult, event: response.id };
	}

	async updateEventParticipants(data: {
		eventId: number;
		ownerId: string;
		participants: Prisma.UserCreateInput[];
	}) {
		const event = await eventRepository.findFirst({
			id: data.eventId,
			ownerId: data.ownerId,
		});
		if (!event) throw new UnauthorizedError();

		const participantsResult = await userRepository.upsertMany(
			data.participants,
		);
		await eventParticipationRepository.createMany(
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

export const eventsUseCase = new EventsUseCase();
