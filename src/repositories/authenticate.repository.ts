import type { AuthenticateFromLinkDto, SendLinkDTO } from "@/dtos/auth";
import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { prisma } from "@/lib/prisma";
import { resend } from "@/mails/client";
import { AuthenticationMagicLinkTemplate } from "@/mails/template/authentication-magic-link";
import { randomUUIDv7 } from "bun";
import dayjs from "dayjs";

class AuthenticateRepository {
	private createAuthLink(code: string) {
		const authLink = new URL(
			"/auth-links/authenticate",
			`${process.env.API_BASE_URL}`,
		);
		authLink.searchParams.set("code", code);
		return authLink;
	}

	private async sendEmail(email: string, authLink: URL) {
		await resend.emails.send({
			from: "Acme <onboarding@resend.dev>",
			to: email,
			subject: "Link para login",
			react: AuthenticationMagicLinkTemplate({
				userEmail: email,
				authLink: authLink.toString(),
			}),
		});
	}

	async sendAuthLink({ email }: SendLinkDTO) {
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

		const authLink = this.createAuthLink(authLinkCode);
		//await this.sendEmail(email, authLink);

		return {
			authLink: authLink.toString(),
		};
	}

	async authenticateFromLink({ code }: AuthenticateFromLinkDto) {
		const authLinkFromCode = await prisma.authLink.findFirst({
			where: {
				code,
			},
		});
		if (!authLinkFromCode) throw new UnauthorizedError();

		if (dayjs().diff(authLinkFromCode.createdAt, "days") > 7) {
			throw new UnauthorizedError();
		}

		await prisma.authLink.delete({
			where: {
				id: authLinkFromCode.id,
			},
		});

		return authLinkFromCode;
	}
}

export const authenticateRepository = new AuthenticateRepository();
