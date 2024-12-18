import { sendAuthLinkEmail } from "@/emails/handlers/send-auth-link-email";
import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import type { AuthLinkRepository } from "@/repositories/auth-link-repository";
import type { UserRepository } from "@/repositories/user-repository";
import { randomUUIDv7 } from "bun";

export class SendAuthLink {
	constructor(
		private authLinkRepository: AuthLinkRepository,
		private userRepository: UserRepository,
	) {}

	async execute(data: { email: string }) {
		const userFromEmail = await this.userRepository.findByEmail(data.email);

		if (!userFromEmail) {
			throw new UnauthorizedError();
		}

		const authLinkCode = randomUUIDv7();
		const authLink = new URL(
			"/auth-links/authenticate",
			`${process.env.API_BASE_URL}`,
		);
		authLink.searchParams.set("code", authLinkCode);

		await Promise.all([
			this.authLinkRepository.create({
				userId: userFromEmail.id,
				code: authLinkCode,
			}),
			sendAuthLinkEmail(userFromEmail.email, authLink),
		]);

		return {
			authLink,
		};
	}
}
