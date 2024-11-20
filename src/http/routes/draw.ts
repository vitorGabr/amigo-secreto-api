import { drawService } from "@/services/draw-service";
import Elysia, { t } from "elysia";

export const drawRoute = new Elysia().get(
	"/events/:eventId/pairings",
	async ({ params, set }) => {
		await drawService.execute(params.eventId);
		set.status = 201;
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
	},
);
