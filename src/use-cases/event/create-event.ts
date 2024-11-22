import type { EventRepository } from "@/repositories/event-repository";
import type { Prisma } from "@prisma/client";

export class CreateEvent {
	constructor(private eventRepository: EventRepository) {}

	async execute(data: Prisma.EventUncheckedCreateInput) {
		const response = await this.eventRepository.create(data);
		return response;
	}
}
