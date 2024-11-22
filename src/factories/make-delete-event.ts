import { EventRepository } from "@/repositories/event-repository";
import { DeleteEvent } from "@/use-cases/event/delete-event";

export function makeDeleteEventUseCase() {
	const eventRepository = new EventRepository();
	const deleteEventUseCase = new DeleteEvent(eventRepository);
	return deleteEventUseCase;
}
