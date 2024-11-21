import type { AddEventDTO, UpdateEventDTO } from "@/dtos/events";
import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { prisma } from "@/lib/prisma";

class EventRepository {
	private async upsertParticipants(participants: AddEventDTO["participants"]) {
		const response = await prisma.$transaction(
			participants.map((part) =>
				prisma.user.upsert({
					create: part,
					update: {},
					where: { email: part.email },
					select: {
						id: true,
					},
				}),
			),
		);

		return response;
	}

	async create({ event, participants, userId }: AddEventDTO) {
		const response = await prisma.event.create({
			data: { name: event, ownerId: userId },
			select: {
				id: true,
			},
		});

		const participantsResult = await this.upsertParticipants(participants);

		await prisma.eventParticipant.createMany({
			data: participantsResult.map((participant) => {
				return {
					eventId: response.id,
					userId: participant.id,
				};
			}),
		});

		return { participants: participantsResult, event: response.id };
	}

	async updateParticipants({ eventId, participants, userId }: UpdateEventDTO) {
		const event = await prisma.event.findFirst({
			where: { id: eventId, ownerId: userId },
			select: {
				id: true,
			},
		});
		if (!event) throw new UnauthorizedError();

		const participantsResult = await this.upsertParticipants(participants);

		await prisma.eventParticipant.createMany({
			data: participantsResult.map((participant) => {
				return {
					eventId: event.id,
					userId: participant.id,
				};
			}),
		});
	}
}

export const eventRepository = new EventRepository();
