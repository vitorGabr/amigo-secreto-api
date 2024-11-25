import { EventRepository } from "@/repositories/event-repository";
import { UpdateEvent } from "@/use-cases/event/update-event";

export function makeUpdateEventUseCase() {
	const eventRepository = new EventRepository();
	const updateEventUseCase = new UpdateEvent(eventRepository);
	return updateEventUseCase;
}
