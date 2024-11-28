import { makeGetEventByIdUseCase } from "@/factories/make-get-event-by-id";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const getEventById = new Elysia().use(authentication).get(
	"/events/:eventId",
	async ({ params, getCurrentUser }) => {
		const { sub } = await getCurrentUser();
		const getEventById = makeGetEventByIdUseCase();
		const response = await getEventById.execute(params.eventId, sub);
		return response;
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
		response: t.Object(
			{
				id: t.Number(),
				name: t.String(),
				exchangeDate: t.Nullable(t.Date()),
				budget: t.Nullable(t.Number()),
				description: t.Nullable(t.String()),
				ownerId: t.String(),
			},
			{
				description: "Event details",
			},
		),
		type: "json",
	},
);
