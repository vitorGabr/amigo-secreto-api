import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type Participant = Prisma.ParticipantCreateInput;

class ParticipantService {
	async findParticipantsByEventId(eventId: number) {
		const response = await db.participant.findMany({
			where: {
				eventParticipant: {
					some: {
						eventId,
					},
				},
			},
			select: {
				id: true,
			},
		});

		return response.map((participant) => participant.id);
	}

	async upsertParticipants(participants: Participant[]) {
		const response = await db.$transaction(
			participants.map((part) =>
				db.participant.upsert({
					create: part,
					update: {},
					where: { email: part.email },
					select: {
						id: true,
					},
				}),
			),
		);
		return response.map((participant) => participant.id);
	}

	async registerParticipantsForEvent(
		participants: Participant[],
		eventId: number,
	) {
		const participantIds = await this.upsertParticipants(participants);
		await db.eventParticipant.createMany({
			data: participantIds.map((id) => {
				return {
					eventId,
					participantId: id,
				};
			}),
		});
		return participantIds;
	}

	async deleteParticipants(participantIds: string[]) {
		await db.participant.deleteMany({
			where: {
				id: {
					in: participantIds,
				},
			},
		});
	}
}

export const participantService = new ParticipantService();
