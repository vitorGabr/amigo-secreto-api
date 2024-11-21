import { eventsUseCase } from "@/use-cases/events";
import Elysia, { t } from "elysia";
import { authentication } from "../middleware/authentication";

export const eventsRoute = new Elysia({
	tags: ["events"],
})
	.use(authentication)
	.post(
		"/events",
		async ({ body, getCurrentUser, set }) => {
			const { sub } = await getCurrentUser();
			const response = await eventsUseCase.createEvent({
				event: { ownerId: sub, name: body.event },
				participants: body.participants,
			});

			set.status = 201;
			return response;
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
	)
	.put(
		"/events/:eventId/participants",
		async ({ params, body, getCurrentUser, set }) => {
			const { sub } = await getCurrentUser();
			await eventsUseCase.updateEventParticipants({
				ownerId: sub,
				eventId: params.eventId,
				participants: body,
			});
			set.status = 200;
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
		},
	);
