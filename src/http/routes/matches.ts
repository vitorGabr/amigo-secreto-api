import { matchesUseCases } from "@/use-cases/matches";
import Elysia, { t } from "elysia";
import { authentication } from "../middleware/authentication";

export const matchesRoute = new Elysia({
	tags: ["matches"],
})
	.use(authentication)
	.get(
		"/events/:eventId/pairings",
		async ({ params, getCurrentUser, set }) => {
			const { sub } = await getCurrentUser();
			await matchesUseCases.generate({ eventId: params.eventId, userId: sub });
			set.status = 201;
		},
		{
			params: t.Object({
				eventId: t.Number(),
			}),
		},
	);
