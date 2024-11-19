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
					where: {
						eventId: params.eventId,
					},
				},
			},
		});

		return response?.receiver[0];
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
		query: t.Object({
			participantId: t.String(),
		}),
	},
);
