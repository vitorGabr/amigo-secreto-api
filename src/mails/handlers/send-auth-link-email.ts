import { resend } from "../client";
import { AuthenticationMagicLinkTemplate } from "../template/authentication-magic-link";

export async function sendAuthLinkEmail(email: string, authLink: URL) {
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
