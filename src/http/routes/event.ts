import { eventService } from "@/services/event-service";
import { participantService } from "@/services/participant-service";
import Elysia, { NotFoundError, t } from "elysia";

export const eventRoute = new Elysia()
	.post(
		"/events",
		async ({ body, set }) => {
			set.status = 201;
			const event = await eventService.createEvent({ name: body.event });
			const participants =
				await participantService.registerParticipantsForEvent(
					body.participants,
					event.id,
				);
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
				participants: t.Array(t.String()),
			}),
		},
	)
	.put(
		"/events/:eventId",
		async ({ body, params, set }) => {
			set.status = 200;
			const event = await eventService.updateEvent(params.eventId, body);
			if (!event) {
				throw new NotFoundError();
			}
		},
		{
			body: t.Object({
				name: t.String(),
			}),
			params: t.Object({
				eventId: t.Number(),
			}),
		},
	)
	.put(
		"/events/:eventId/participants",
		async ({ body, params, set }) => {
			set.status = 200;
			const event = await eventService.getEvent(params.eventId);
			if (!event) {
				throw new NotFoundError();
			}
			const participants =
				await participantService.registerParticipantsForEvent(
					body,
					params.eventId,
				);
			return { event: event.id, participants };
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
