import type { events } from "@/db/schemas";
import type { EventRepository } from "@/repositories/event-repository";
import dayjs from "dayjs";
import type { InferInsertModel } from "drizzle-orm";

export class CreateEvent {
	constructor(private eventRepository: EventRepository) {}

	async execute(data: InferInsertModel<typeof events>) {
		if(dayjs(data.exchangeDate).isBefore(dayjs())) {
			throw new Error("Exchange date must be in the future");
		}
		const response = await this.eventRepository.create(data);
		return response;
	}
}
