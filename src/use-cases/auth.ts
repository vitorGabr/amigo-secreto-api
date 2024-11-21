import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { sendAuthLinkEmail } from "@/mails/handlers/send-auth-link-email";
import { authLinkRepository } from "@/repositories/auth-link";
import { userRepository } from "@/repositories/user";
import { createAuthLink } from "@/utils/create-auth-link";
import { randomUUIDv7 } from "bun";
import dayjs from "dayjs";

class AuthUseCase {
	async sendAuthLink(data: { email: string }) {
		const userFromEmail = await userRepository.findByEmail(data.email);

		if (!userFromEmail) throw new UnauthorizedError();

		const authLinkCode = randomUUIDv7();
		await authLinkRepository.create({
			userId: userFromEmail.id,
			code: authLinkCode,
		});
		const authLink = createAuthLink(authLinkCode);
		await sendAuthLinkEmail(userFromEmail.email, authLink);

		return {
			authLink: authLink.toString(),
		};
	}

	async authenticateFromLink(data: { code: string }) {
		const authLinkFromCode = await authLinkRepository.findByCode(data.code);
		if (!authLinkFromCode) throw new UnauthorizedError();

		if (dayjs().diff(authLinkFromCode.createdAt, "days") > 7) {
			throw new UnauthorizedError();
		}

		await authLinkRepository.delete(authLinkFromCode.id);
		return authLinkFromCode;
	}

	async signUp(user: { email: string; name: string }) {
		await userRepository.create(user);
	}
}

export const authUseCase = new AuthUseCase();
