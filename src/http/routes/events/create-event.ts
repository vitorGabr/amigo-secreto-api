import { makeAddParticipantsToEventUseCase } from "@/factories/make-add-participants-to-event";
import { makeCreateEventUseCase } from "@/factories/make-create-event";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const createEvent = new Elysia().use(authentication).post(
	"/events",
	async ({ body, getCurrentUser, set }) => {
		const { participants, ...data } = body;
		const { sub } = await getCurrentUser();
		const makeCreateEvent = makeCreateEventUseCase();
		const makeAddParticipants = makeAddParticipantsToEventUseCase();
		const response = await makeCreateEvent.execute({
			...data,
			ownerId: sub,
		});

		if (participants) {
			await makeAddParticipants.execute({
				eventId: response.id,
				ownerId: sub,
				participants,
			});
		}
		set.status = 201;
		return response;
	},
	{
		body: t.Object({
			name: t.String(),
			exchangeDate: t.Optional(t.Date()),
			budget: t.Optional(t.Number()),
			description: t.Optional(t.String()),
			participants: t.Optional(
				t.Array(
					t.Object({
						name: t.String(),
						email: t.String({ format: "email" }),
					}),
					{
						maxItems: 50,
					},
				),
			),
		}),
		response: t.Object({
			id: t.Number(),
		}),
	},
);
