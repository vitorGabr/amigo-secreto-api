import { makeUpdateEventUseCase } from "@/factories/make-update-event";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const updateEvent = new Elysia().use(authentication).put(
	"/events/:eventId",
	async ({ body, params, getCurrentUser, set }) => {
		const { sub } = await getCurrentUser();
		const makeUpdateEvent = makeUpdateEventUseCase();
		await makeUpdateEvent.execute(params.eventId, sub, body);
		set.status = 204;
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
		body: t.Partial(
			t.Object({
				name: t.String(),
				exchangeDate: t.String({ format: "date" }),
				budget: t.Number(),
				description: t.String(),
			}),
		),
	},
);
