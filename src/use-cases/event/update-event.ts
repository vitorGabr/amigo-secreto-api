import { NotAOwnerError } from "@/http/errors/not-a-owner-error";
import type { EventRepository } from "@/repositories/event-repository";
import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";

export class UpdateEvent {
	constructor(private eventRepository: EventRepository) {}

	async execute(id: number, ownerId: string, data: Prisma.EventUpdateInput) {
		const event = await this.eventRepository.get(id, ownerId);
		if (!event) throw new NotAOwnerError();
		if (data.exchangeDate && dayjs(`${data.exchangeDate}`).isBefore(dayjs())) {
			throw new Error("Exchange date must be in the future");
		}
		const response = await this.eventRepository.update(id, data);
		return response;
	}
}
