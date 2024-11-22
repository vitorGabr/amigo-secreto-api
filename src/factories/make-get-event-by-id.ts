import { EventRepository } from "@/repositories/event-repository";
import { GetEventById } from "@/use-cases/event/get-event-by-id";

export function makeGetEventByIdUseCase() {
	const eventRepository = new EventRepository();
	const getEventByIdUseCase = new GetEventById(eventRepository);
	return getEventByIdUseCase;
}
