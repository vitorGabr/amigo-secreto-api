import { prisma } from "@/lib/prisma";
import { NotFoundError } from "elysia";

class RevealService {
	async execute(participant: string, eventId: number) {
		const response = await prisma.participant.findFirst({
			where: {
				id: participant,
			},
			select: {
				receiver: {
					select: {
						giver: {
							select: {
								name: true,
							},
						},
					},
					take: 1,
					where: {
						eventId,
					},
				},
			},
		});

		if (!response) {
			throw new NotFoundError("No participant found");
		}

		if (response?.receiver.length) {
			throw new Error("No participant found");
		}

		return {
			name: response?.receiver[0].giver.name,
		};
	}
}

export const revealService = new RevealService();
