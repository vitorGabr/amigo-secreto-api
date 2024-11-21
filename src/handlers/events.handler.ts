import type { AddEventDTO, UpdateEventDTO } from "@/dtos/events";
import { eventRepository } from "@/repositories/event.respository";

export async function createEvent(data: AddEventDTO) {
	return eventRepository.create(data);
}

export async function updateEventParticipants(data: UpdateEventDTO) {
	return eventRepository.updateParticipants(data);
}
