import { makeAuthenticateLinkUseCase } from "@/factories/make-authenticate-link";
import { authentication } from "@/http/middleware/authentication";
import Elysia, { t } from "elysia";

export const authenticateLink = new Elysia().use(authentication).get(
	"/auth/email/verify",
	async ({ signUser, query, redirect: internalRedirect }) => {
		const makeAuthenticateFromLink = makeAuthenticateLinkUseCase();
		const reponse = await makeAuthenticateFromLink.execute({
			code: query.code,
		});
		const token = await signUser({
			sub: reponse.userId,
		});

		const redirectUrl = process.env.AUTH_REDIRECT_URL;
		return redirectUrl ? internalRedirect(redirectUrl) : token;
	},
	{
		query: t.Object({
			code: t.String(),
		}),
	},
);
