import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import Elysia, { NotFoundError, t } from "elysia";

export const updateSecretSantaEvent = new Elysia().put(
	"/events/{eventId}",
	async ({ body, params, set }) => {
		const eventId = await db.event.findUnique({
			where: { id: params.eventId },
			select: { id: true },
		}).then((event) => event?.id);
		if (!eventId) throw new NotFoundError();

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
					eventId,
					participantId: participant.id,
				};
			}),
		});

		set.status = 201;
		return {
			event: eventId,
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
