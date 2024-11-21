import { authUseCase } from "@/use-cases/auth";
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
			const response = await authUseCase.sendAuthLink({ email });
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
			const reponse = await authUseCase.authenticateFromLink({
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
	.post(
		"/sign-up",
		async ({ body }) => {
			await authUseCase.signUp(body);
		},
		{
			body: t.Object({
				email: t.String({ format: "email" }),
				name: t.String(),
			}),
		},
	)
	.post("/sign-out", async ({ signOut: internalSignOut }) => {
		internalSignOut();
	});
