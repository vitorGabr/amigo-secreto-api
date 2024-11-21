import { prisma } from "@/lib/prisma";
import { randomUUIDv7 } from "bun";
import Elysia, { t } from "elysia";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const sendAuthenticationLink = new Elysia().post(
	"/authenticate",
	async ({ body }) => {
		const { email } = body;
		const userFromEmail = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (!userFromEmail) {
			throw new UnauthorizedError();
		}

		const authLinkCode = randomUUIDv7();
		await prisma.authLink.create({
			data: {
				userId: userFromEmail.id,
				code: authLinkCode,
			},
		});

		const authLink = new URL(
			"/auth-links/authenticate",
			`${process.env.API_BASE_URL}`,
		);
		authLink.searchParams.set("code", authLinkCode);

		// await resend.emails.send({
		// 	from: "Acme <onboarding@resend.dev>",
		// 	to: userFromEmail.email,
		// 	subject: "Link para login",
		// 	react: AuthenticationMagicLinkTemplate({
		// 		userEmail: email,
		// 		authLink: authLink.toString(),
		// 	}),
		// });

		return {
			authLink: authLink.toString(),
		};
	},
	{
		body: t.Object({
			email: t.String({ format: "email" }),
		}),
		response: t.Object({
			authLink: t.String(),
		}),
	},
);
