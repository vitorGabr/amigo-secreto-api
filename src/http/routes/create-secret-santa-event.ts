import { db } from "@/lib/db";
import Elysia, {  t } from "elysia";

export const createSecretSantaEvent = new Elysia().post(
	"/events",
	async ({ body, set }) => {
		set.status = 201;
		const event = await db.event.create({
			data: {
				name: body.event,
			},
			select: {
				id: true,
			},
		});
		const response = await db.$transaction(
			body.participants.map((part) =>
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

		await db.eventParticipant.createMany({
			data: response.map((participant) => {
				return {
					eventId: event.id,
					participantId: participant.id,
				};
			}),
		});

		return {
			event: event.id,
			participants: response.map((participant) => participant.id),
		};
	},
	{
		body: t.Object({
			participants: t.Array(
				t.Object({
					name: t.String(),
					email: t.String(),
				}),
			),
			event: t.String(),
		}),
		response: t.Object({
			event: t.Number(),
			participants: t.Array(t.String()),
		}),
	},
);
