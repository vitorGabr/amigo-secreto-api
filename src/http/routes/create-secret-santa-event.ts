import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import Elysia, { t } from "elysia";

export const createSecretSantaEvent = new Elysia().post(
	"/events",
	async ({ body, set }) => {
		set.status = 201;
		const eventId = Number.isNaN(+body.event)
			? await db.event
					.create({
						data: { name: `${body.event}` },
						select: { id: true },
					})
					.then((event) => event.id)
			: +body.event;

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
			event: t.Union([t.String(), t.Number()]),
		}),
		response: t.Object({
			event: t.Number(),
			participants: t.Array(t.String()),
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
