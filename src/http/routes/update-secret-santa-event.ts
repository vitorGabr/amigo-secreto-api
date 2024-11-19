import { db } from "@/lib/db";
import { upsertParticipants } from "@/services/upsert-participants";
import { Prisma } from "@prisma/client";
import Elysia, { NotFoundError, t } from "elysia";

export const updateSecretSantaEvent = new Elysia().put(
	"/events/{eventId}",
	async ({ body, params, set }) => {
		const eventId = await db.event
			.findUnique({
				where: { id: params.eventId },
				select: { id: true },
			})
			.then((event) => event?.id);
		if (!eventId) throw new NotFoundError();

		const participants = await upsertParticipants(body.participants);

		await db.eventParticipant.createMany({
			data: participants.map((id) => {
				return {
					eventId,
					participantId: id,
				};
			}),
		});

		set.status = 201;
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
		}),
		response: t.Object({
			event: t.Number(),
			participants: t.Array(t.String()),
		}),
		params: t.Object({
			eventId: t.Number(),
		}),
		error: ({ error, set }) => {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				set.status = 400;
				if (error.meta) {
					if ("modelName" in error.meta) {
						if (error.meta.modelName === "EventParticipant") {
							return {
								error: "Event already exists",
							};
						}
					}
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
