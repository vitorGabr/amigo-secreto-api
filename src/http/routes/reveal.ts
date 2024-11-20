import { revealService } from "@/services/reveal-service";
import Elysia, { t } from "elysia";

export const revealRoute = new Elysia().get(
	"/events/{eventId}/secret-friend",
	async ({ query, params }) => {
		const response = await revealService.execute(
			query.participantId,
			params.eventId,
		);
		return response;
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
		query: t.Object({
			participantId: t.String(),
		}),
		response: t.Object({
			name: t.String(),
		}),
	},
);
