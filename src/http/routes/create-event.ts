import { prisma } from "@/lib/prisma";
import Elysia, { t } from "elysia";
import { authentication } from "../authentication";

export const createEvent = new Elysia().use(authentication).post(
	"/events",
	async ({ body, getCurrentUser, set }) => {
		const { sub } = await getCurrentUser();
		const event = await prisma.event.create({
			data: { name: body.event, ownerId: sub },
			select: {
				id: true,
			},
		});

		const participants = await prisma.$transaction(
			body.participants.map((part) =>
				prisma.user.upsert({
					create: part,
					update: {},
					where: { email: part.email },
					select: {
						id: true,
					},
				}),
			),
		);

		await prisma.eventParticipant.createMany({
			data: participants.map((participant) => {
				return {
					eventId: event.id,
					userId: participant.id,
				};
			}),
		});

		set.status = 201;
		return { event: event.id, participants };
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
			participants: t.Array(t.Object({ id: t.String() })),
		}),
	},
);
