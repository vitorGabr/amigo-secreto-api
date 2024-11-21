import { createUser } from "@/handlers/users.handler";
import Elysia, { t } from "elysia";

export const usersRoute = new Elysia({
	tags: ["users"],
}).post(
	"/users",
	async ({ body, set }) => {
		await createUser(body);
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
