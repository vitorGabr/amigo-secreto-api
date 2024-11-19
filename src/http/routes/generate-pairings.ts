import { db } from "@/lib/db";
import Elysia, { t } from "elysia";

export const generatePairings = new Elysia().post(
	"/events/{eventId}/pairings",
	async ({ params, set }) => {
		const participants = await db.participant.findMany({
			where: {
				eventParticipant: {
					some: {
						eventId: params.eventId,
					},
				},
			},
		});

		if (participants.length < 2) {
			throw new Error("Not enough participants in group");
		}

		const shuffledParticipants = participants.sort(() => Math.random() - 0.5);
		const matches = shuffledParticipants.map((participant, index) => {
			const nextParticipant =
				shuffledParticipants[index + 1] || shuffledParticipants[0];
			return {
				giver: participant,
				reciver: nextParticipant,
			};
		});

		await db.match.createMany({
			data: matches.map((match) => ({
				eventId: params.eventId,
				giverId: match.giver.id,
				receiverId: match.reciver.id,
			})),
		});
		set.status = 201;
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
	},
);
