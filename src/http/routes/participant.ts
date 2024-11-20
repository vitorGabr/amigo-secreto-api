import { participantService } from "@/services/participant-service";
import Elysia, { t } from "elysia";

export const participantRoute = new Elysia()
	.post(
		"/participants",
		async ({ body, set }) => {
			set.status = 201;
			const participants = await participantService.upsertParticipants(body);
			return participants;
		},
		{
			body: t.Array(
				t.Object({
					name: t.String(),
					email: t.String(),
				}),
			),
			response: t.Array(t.String()),
		},
	)
	.delete(
		"/participants",
		async ({ body, set }) => {
			set.status = 200;
			await participantService.deleteParticipants(body);
		},
		{
			body: t.Array(t.String()),
		},
	);
