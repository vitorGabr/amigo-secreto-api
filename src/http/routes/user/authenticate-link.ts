import { makeAuthenticateLinkUseCase } from "@/factories/make-authenticate-link";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const authenticateLink = new Elysia().use(authentication).get(
	"/auth/email/verify",
	async ({ signUser, query, redirect }) => {
		const makeAuthenticateFromLink = makeAuthenticateLinkUseCase();
		const reponse = await makeAuthenticateFromLink.execute({
			code: query.code,
		});
		await signUser({
			sub: reponse.userId,
		});

		const redirectUrl = process.env.AUTH_REDIRECT_URL ?? "";
		return redirect(redirectUrl, 302);
	},
	{
		query: t.Object({
			code: t.String(),
		}),
		response: {
			302: t.Object({}),
		},
		type: "json",
	},
);
