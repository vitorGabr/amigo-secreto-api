import { prisma } from "@/lib/prisma";
import Elysia, { t } from "elysia";
import { authentication } from "../authentication";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const removeParticipantFromEvent = new Elysia()
	.use(authentication)
	.delete(
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

			await prisma.eventParticipant.deleteMany({
				where: {
					eventId: params.eventId,
					userId: {
						in: body,
					},
				},
			});

			set.status = 201;
		},
		{
			body: t.Array(t.String()),
			params: t.Object({
				eventId: t.Number(),
			}),
		},
	);
