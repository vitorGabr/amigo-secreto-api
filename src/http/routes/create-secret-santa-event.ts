import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import Elysia, { NotFoundError, t } from "elysia";

export const createSecretSantaEvent = new Elysia().post(
	"/events",
	async ({ body, set }) => {
		set.status = 201;
		const event = await db.event.create({
			data: {
				name: body.eventName,
			},
			select: {
				id: true,
			},
		});
		const response = await db.$transaction(
			body.participants.map((part) =>
				db.participant.upsert({
					create: { name: part.name, email: part.email },
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
			eventName: t.String(),
		}),
		error: ({ error }) => {
			if (error instanceof Prisma.PrismaClientKnownRequestError) {
				if (error.meta) {
					if ("target" in error.meta && Array.isArray(error.meta.target)) {
						if (error.meta.target.includes("email")) {
							throw new NotFoundError("Email already exists");
						}
					}
				}
			}
		},
	},
);
