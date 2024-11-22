import { EventRepository } from "@/repositories/event-repository";
import { CreateEvent } from "@/use-cases/event/create-event";

export function makeCreateEventUseCase() {
	const eventRepository = new EventRepository();
	const createEventUseCase = new CreateEvent(eventRepository);
	return createEventUseCase;
}
