import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { eventRepository } from "@/repositories/event";
import type { Prisma } from "@prisma/client";

class EventsUseCase {
	async create(data: Prisma.EventUncheckedCreateInput) {
		const response = await eventRepository.create(data);
		return response;
	}

	async update(
		id: number,
		ownerId: string,
		data: Prisma.EventUpdateInput,
	) {
		const event = await eventRepository.get(id, ownerId);
		if (!event) throw new UnauthorizedError();
		const response = await eventRepository.update(id, data);
		return response;
	}

	async delete(eventId: number, ownerId: string) {
		const event = await eventRepository.get(eventId, ownerId);
		if (!event) throw new UnauthorizedError();
		await eventRepository.delete(eventId);
	}
}

export const eventsUseCase = new EventsUseCase();
