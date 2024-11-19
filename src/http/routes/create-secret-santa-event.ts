import { db } from "@/lib/db";
import { upsertParticipants } from "@/services/upsert-participants";
import { Prisma } from "@prisma/client";
import Elysia, { t } from "elysia";

export const createSecretSantaEvent = new Elysia().post(
	"/events",
	async ({ body, set }) => {
		set.status = 201;
		const eventId = await db.event
			.create({
				data: { name: `${body.event}` },
				select: { id: true },
			})
			.then((event) => event.id);

		const participants = await upsertParticipants(body.participants);
		await db.eventParticipant.createMany({
			data: participants.map((id) => {
				return {
					eventId,
					participantId: id,
				};
			}),
		});

		return {
			event: eventId,
			participants,
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
		error: ({ error, set }) => {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				set.status = 400;
				if (error.meta) {
					if (Array.isArray(error.meta.target)) {
						if (error.meta.target.includes("participantId")) {
							return {
								error: "Participant already exists in the event",
							};
						}
					}
				}
			}
		},
	},
);
