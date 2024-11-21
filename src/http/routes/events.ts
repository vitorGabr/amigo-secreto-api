import { eventsUseCase } from "@/use-cases/events";
import Elysia, { t } from "elysia";
import { authentication } from "../middleware/authentication";

export const eventsRoute = new Elysia({
	tags: ["events"],
})
	.use(authentication)
	.post(
		"/events",
		async ({ body, getCurrentUser, set }) => {
			const { sub } = await getCurrentUser();
			const response = await eventsUseCase.create({
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
	)
	.put(
		"/events/:id",
		async ({ body, params, getCurrentUser, set }) => {
			const { sub } = await getCurrentUser();
			await eventsUseCase.update(params.id, sub, body);
			set.status = 200;
		},
		{
			params: t.Object({
				id: t.Number(),
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
	)
	.delete(
		"/events/:id",
		async ({ params, getCurrentUser, set }) => {
			const { sub } = await getCurrentUser();
			await eventsUseCase.delete(params.id, sub);
			set.status = 204;
		},
		{
			params: t.Object({
				id: t.Number(),
			}),
		},
	);
