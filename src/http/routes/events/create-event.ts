import { makeCreateEventUseCase } from "@/factories/make-create-event";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const createEvent = new Elysia().use(authentication).post(
	"/events",
	async ({ body, getCurrentUser, set }) => {
		const { sub } = await getCurrentUser();
		const makeCreateEvent = makeCreateEventUseCase();
		const response = await makeCreateEvent.execute({
			...body,
			ownerId: sub,
		});

		set.status = 201;
		return response;
	},
	{
		body: t.Object({
			name: t.String(),
			exchangeDate: t.Optional(t.String({ format: "date" })),
			budget: t.Optional(t.Number()),
			description: t.Optional(t.String()),
		}),
		response: t.Object({
			id: t.Number(),
		}),
	},
);
