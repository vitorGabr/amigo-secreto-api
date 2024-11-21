import Elysia, { t } from "elysia";
import { authentication } from "../middleware/authentication";
import { eventParticipantsUseCase } from "@/use-cases/event-participants";

export const eventParticipantsRoute = new Elysia({
	tags: ["events-participants"],
})
	.use(authentication)
	.put(
		"/events/:eventId/participants",
		async ({ params, body, getCurrentUser, set }) => {
			const { sub } = await getCurrentUser();
			await eventParticipantsUseCase.update({
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
			error: ({ code }) => {
				switch (code as unknown as string) {
					case "P2002":
						return {
							message: "Participant already exists in the event",
						};
					default:
				}
			},
		},
	);
