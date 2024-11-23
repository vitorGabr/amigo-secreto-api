import type { EventRepository } from "@/repositories/event-repository";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";

export class CreateEvent {
	constructor(private eventRepository: EventRepository) {}

	async execute(data: Prisma.EventUncheckedCreateInput) {
		if(dayjs(data.exchangeDate).isBefore(dayjs())) {
			throw new Error("Exchange date must be in the future");
		}
		const response = await this.eventRepository.create(data);
		return response;
	}
}
