import { NotAOwnerError } from "@/http/errors/not-a-owner-error";
import type { EventRepository } from "@/repositories/event-repository";
import type { Prisma } from "@prisma/client";

export class UpdateEvent {
	constructor(private eventRepository: EventRepository) {}

	async execute(id: number, ownerId: string, data: Prisma.EventUpdateInput) {
		const event = await this.eventRepository.get(id, ownerId);
		if (!event) throw new NotAOwnerError();
		const response = await this.eventRepository.update(id, data);
		return response;
	}
}
