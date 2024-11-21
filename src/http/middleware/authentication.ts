import cookie from "@elysiajs/cookie";
import jwt from "@elysiajs/jwt";
import Elysia, { type Static, t } from "elysia";
import { UnauthorizedError } from "../errors/unauthorized-error";

const jwtPayloadSchema = t.Object({
	sub: t.String(),
});

export const authentication = new Elysia()
	.error({
		UNAUTHORIZED: UnauthorizedError,
	})
	.onError(({ code, error, set }) => {
		switch (code) {
			case "UNAUTHORIZED":
				set.status = 401;
				return { code, message: error.message };
		}
	})
	.use(
		jwt({
			name: "jwt",
			secret: `${process.env.JWT_SECRET}`,
			schema: jwtPayloadSchema,
		}),
	)
	.use(cookie())
	.derive({ as: "scoped" }, ({ jwt, cookie: { auth } }) => {
		return {
			getCurrentUser: async () => {
				const payload = await jwt.verify(auth.value);
				if (!payload) throw new UnauthorizedError();
				return payload;
			},
			signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
				const token = await jwt.sign(payload);
				auth.set({
					value: token,
					httpOnly: true,
					maxAge: 7 * 86400,
					path: "/",
				});
				return token;
			},
			signOut: () => {
				auth.remove();
			},
		};
	});
