import { makeAddParticipantsToEventUseCase } from "@/factories/make-add-participants-to-event";
import { makeUpdateEventUseCase } from "@/factories/make-update-event";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const updateEvent = new Elysia().use(authentication).put(
	"/events/:eventId",
	async ({ body, params, getCurrentUser, set }) => {
		const { participants, ...data } = body;
		const { sub } = await getCurrentUser();
		const makeUpdateEvent = makeUpdateEventUseCase();
		const makeAddParticipants = makeAddParticipantsToEventUseCase();
		await makeUpdateEvent.execute(params.eventId, sub, data);
		if (participants) {
			await makeAddParticipants.execute({
				eventId: params.eventId,
				ownerId: sub,
				participants,
			});
		}
		set.status = 204;
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
		body: t.Partial(
			t.Object({
				name: t.String(),
				exchangeDate: t.Date(),
				budget: t.Number(),
				description: t.String(),
				participants: t.Array(
					t.Object({
						name: t.String(),
						email: t.String({ format: "email" }),
					}),
					{
						maxItems: 50,
					},
				),
			}),
		),
	},
);
