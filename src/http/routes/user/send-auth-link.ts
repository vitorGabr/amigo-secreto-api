import { makeSendAuthLinkUseCase } from "@/factories/make-send-auth-link";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const sendAuthLink = new Elysia().use(authentication).post(
	"/auth/email/send",
	async ({ body }) => {
		const sendAuthLink = makeSendAuthLinkUseCase();
		const response = await sendAuthLink.execute(body);
		return {
			authLink: response.authLink.toString(),
		};
	},
	{
		body: t.Object({
			email: t.String({ format: "email" }),
		}),
		response: t.Object(
			{
				authLink: t.String(),
			},
			{
				description: "Auth link sent",
			},
		),
		type: "json",
	},
);
