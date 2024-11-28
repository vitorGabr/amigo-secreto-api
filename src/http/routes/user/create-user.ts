import { makeCreateUserUseCase } from "@/factories/make-create-user";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const createUser = new Elysia().use(authentication).post(
	"/sign-up",
	async ({ body }) => {
		const createUser = makeCreateUserUseCase();
		await createUser.execute(body);
	},
	{
		body: t.Object({
			email: t.String({ format: "email" }),
			name: t.String(),
		}),
		response: t.Void({
			description: "User created",
		}),
		type: "json",
	},
);
