import { makeGenerateMatchesUseCase } from "@/factories/make-generate-matches";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const generateMatches = new Elysia().use(authentication).get(
	"/events/:eventId/matches",
	async ({ params, getCurrentUser, set }) => {
		const { sub } = await getCurrentUser();
		const makeGenerateMatches = makeGenerateMatchesUseCase();
		await makeGenerateMatches.execute({ eventId: params.eventId, userId: sub });
		set.status = 201;
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
		response: {
			201: t.Void({
				description: "Matches generated successfully",
			}),
		},
		type: "json",
	},
);
