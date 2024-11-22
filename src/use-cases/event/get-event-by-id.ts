import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import type { EventRepository } from "@/repositories/event-repository";

export class GetEventById {
	constructor(private eventRepository: EventRepository) {}

	async execute(id: number, ownerId: string) {
		const event = await this.eventRepository.get(id, ownerId);
		if (!event) throw new UnauthorizedError();
		return event;
	}
}
