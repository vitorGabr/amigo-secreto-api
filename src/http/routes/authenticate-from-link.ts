import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import Elysia, { t } from "elysia";
import { authentication } from "../authentication";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const authenticateFromLink = new Elysia().use(authentication).get(
	"/auth-links/authenticate",
	async ({ signUser, query, redirect: internalRedirect }) => {
		const { code } = query;
		const authLinkFromCode = await prisma.authLink.findFirst({
			where: {
				code,
			},
		});
		if (!authLinkFromCode) throw new UnauthorizedError();

		if (dayjs().diff(authLinkFromCode.createdAt, "days") > 7) {
			throw new UnauthorizedError();
		}
		const token = await signUser({
			sub: authLinkFromCode.userId,
		});
		await prisma.authLink.delete({
			where: {
				id: authLinkFromCode.id,
			},
		});

		const redirectUrl = process.env.AUTH_REDIRECT_URL;
		return redirectUrl ? internalRedirect(redirectUrl) : token;
	},
	{
		query: t.Object({
			code: t.String(),
			redirect: t.Optional(t.String()),
		}),
	},
);
