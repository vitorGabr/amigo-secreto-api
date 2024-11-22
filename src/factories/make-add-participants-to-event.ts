import { EventParticipantsRepository } from "@/repositories/event-participants-repository";
import { EventRepository } from "@/repositories/event-repository";
import { UserRepository } from "@/repositories/user-repository";
import { AddParticipantsToEvent } from "@/use-cases/event-participant/add-participants-to-event";

export function makeAddParticipantsToEventUseCase() {
	const eventParticipantRepository = new EventParticipantsRepository();
	const eventRepository = new EventRepository();
	const userRepository = new UserRepository();
	const addParticipantsToEventUseCase = new AddParticipantsToEvent(
		eventRepository,
		eventParticipantRepository,
		userRepository,
	);
	return addParticipantsToEventUseCase;
}
