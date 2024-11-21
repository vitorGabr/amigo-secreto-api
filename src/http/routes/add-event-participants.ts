import { prisma } from "@/lib/prisma";
import Elysia, { t } from "elysia";
import { authentication } from "../authentication";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const addEventParticipants = new Elysia().use(authentication).post(
	"/events/:eventId/participants",
	async ({ body, getCurrentUser, params, set }) => {
		const { sub } = await getCurrentUser();
		const event = await prisma.event.findFirst({
			where: { id: params.eventId, ownerId: sub },
			select: {
				id: true,
			},
		});

		if (!event) throw new UnauthorizedError();

		const participants = await prisma.$transaction(
			body.map((part) =>
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
		return { participants };
	},
	{
		body: t.Array(
			t.Object({
				name: t.String(),
				email: t.String(),
			}),
		),
		params: t.Object({
			eventId: t.Number(),
		}),
		response: t.Object({
			participants: t.Array(t.Object({ id: t.String() })),
		}),
	},
);
