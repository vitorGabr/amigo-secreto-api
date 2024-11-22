import { makeAddParticipantsToEventUseCase } from "@/factories/make-add-participants-to-event";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const addParticipantsToEvent = new Elysia().use(authentication).put(
	"/events/:eventId/participants",
	async ({ params, body, getCurrentUser, set }) => {
		const { sub } = await getCurrentUser();
		const makeAddParticipantsToEvent = makeAddParticipantsToEventUseCase();
		await makeAddParticipantsToEvent.execute({
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
