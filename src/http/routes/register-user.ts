import { prisma } from "@/lib/prisma";
import Elysia, { t } from "elysia";

export const registerUser = new Elysia().post(
	"/users",
	async ({ body, set }) => {
		await prisma.user.create({
			data: body,
			select: {
				id: true,
				email: true,
			},
		});

		set.status = 201;
	},
	{
		body: t.Object({
			email: t.String({
				format: "email",
			}),
			name: t.String(),
		}),
		error: ({ code }) => {
			//@ts-expect-error
			if (code === "P2002") {
				return {
					message: "Email already exists",
				};
			}
		},
	},
);
