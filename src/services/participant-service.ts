import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

type Participant = Prisma.ParticipantCreateInput;

class ParticipantService {
	async upsertParticipants(participants: Participant[]) {
		const response = await prisma.$transaction(
			participants.map((part) =>
				prisma.participant.upsert({
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
		await prisma.eventParticipant.createMany({
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
		await prisma.participant.deleteMany({
			where: {
				id: {
					in: participantIds,
				},
			},
		});
	}
}

export const participantService = new ParticipantService();
