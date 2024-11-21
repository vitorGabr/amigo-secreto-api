import { usersUseCases } from "@/use-cases/users";
import Elysia, { t } from "elysia";

export const usersRoute = new Elysia({
	tags: ["users"],
}).post(
	"/users",
	async ({ body, set }) => {
		await usersUseCases.create(body);
		set.status = 201;
	},
	{
		body: t.Object({
			email: t.String({
				format: "email",
			}),
			name: t.String(),
		}),
	},
);
