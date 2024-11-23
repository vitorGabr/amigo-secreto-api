import Elysia from "elysia";
import { authenticateLink } from "./authenticate-link";
import { createUser } from "./create-user";
import { sendAuthLink } from "./send-auth-link";

export const authRoutes = new Elysia({
	tags: ["Auth"],
})
	.use(authenticateLink)
	.use(sendAuthLink)
	.use(createUser);
