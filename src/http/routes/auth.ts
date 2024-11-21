import { authLinkUseCase } from "@/use-cases/auth-link";
import Elysia, { t } from "elysia";
import { authentication } from "../middleware/authentication";

export const authRoutes = new Elysia({
	tags: ["auth"],
})
	.use(authentication)
	.post(
		"/authenticate",
		async ({ body }) => {
			const { email } = body;
			const response = await authLinkUseCase.sendAuthLink({ email });
			return response;
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
			}),
			response: t.Object({
				authLink: t.String(),
			}),
		},
	)
	.get(
		"/auth-links/authenticate",
		async ({ signUser, query, redirect: internalRedirect }) => {
			const reponse = await authLinkUseCase.authenticateFromLink({
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
	)
	.post("/sign-out", async ({ signOut: internalSignOut }) => {
		internalSignOut();
	});
