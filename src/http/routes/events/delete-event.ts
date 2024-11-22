import { makeDeleteEventUseCase } from "@/factories/make-delete-event";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const deleteEvent = new Elysia().use(authentication).delete(
	"/events/:eventId",
	async ({ params, getCurrentUser, set }) => {
		const { sub } = await getCurrentUser();
		const makeDeleteEvent = makeDeleteEventUseCase();
		const response = await makeDeleteEvent.execute(params.eventId, sub);

		set.status = 201;
		return response;
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
	},
);
