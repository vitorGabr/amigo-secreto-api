import type { events } from "@/db/schemas";
import { NotAOwnerError } from "@/http/errors/not-a-owner-error";
import type { EventRepository } from "@/repositories/event-repository";
import dayjs from "dayjs";
import type { InferInsertModel } from "drizzle-orm";

export class UpdateEvent {
	constructor(private eventRepository: EventRepository) {}

	async execute(
		id: number,
		ownerId: string,
		data: {
			name?: string;
			exchangeDate?: Date;
			budget?: number;
			description?: string;
		},
	) {
		const event = await this.eventRepository.get(id, ownerId);
		if (!event) throw new NotAOwnerError();
		if (data.exchangeDate && dayjs(`${data.exchangeDate}`).isBefore(dayjs())) {
			throw new Error("Exchange date must be in the future");
		}
		const response = await this.eventRepository.update(id, data);
		return response;
	}
}
