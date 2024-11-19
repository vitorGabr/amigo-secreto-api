import { db } from "@/lib/db";
import Elysia, { t } from "elysia";

export const getSecretFriend = new Elysia().get(
	"/events/{eventId}/secret-friend",
	async ({ query, params }) => {
		const response = await db.participant.findFirst({
			where: {
				id: query.participantId,
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
						eventId: params.eventId,
					},
				},
			},
		});

		if(!response?.receiver.length) {
			throw new Error("No participant found");
		}

		return {
			name: response?.receiver[0].giver.name,
		};
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
		query: t.Object({
			participantId: t.String(),
		}),
		response: t.Object({
			name: t.String(),
		})
	},
);
