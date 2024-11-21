import { generateParings } from "@/handlers/parings.handler";
import Elysia, { t } from "elysia";
import { authentication } from "../middleware/authentication";

export const paringsRoute = new Elysia({
	tags: ["parings"],
})
	.use(authentication)
	.get(
		"/events/:eventId/pairings",
		async ({ params, getCurrentUser, set }) => {
			const { sub } = await getCurrentUser();
			await generateParings({ eventId: params.eventId, userId: sub });
			set.status = 201;
		},
		{
			params: t.Object({
				eventId: t.Number(),
			}),
		},
	);
