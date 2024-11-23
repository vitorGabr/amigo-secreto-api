import { NotAOwnerError } from "@/http/errors/not-a-owner-error";
import type { EventRepository } from "@/repositories/event-repository";

export class DeleteEvent {
	constructor(private eventRepository: EventRepository) {}

	async execute(id: number, ownerId: string) {
		const event = await this.eventRepository.get(id, ownerId);
		if (!event) throw new NotAOwnerError();
		const response = await this.eventRepository.delete(id);
		return response;
	}
}
