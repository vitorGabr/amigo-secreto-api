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
		 const [response, participantsResult] = await Promise.all([
			eventRepository.create(data.event),
			userRepository.upsertMany(data.participants),
		]);
	
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

		const [event, participantsResult] = await Promise.all([
			eventRepository.get(data.eventId, data.ownerId),
			userRepository.upsertMany(data.participants),
		])
		if (!event) throw new UnauthorizedError();
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
