import { AuthLinkRepository } from "@/repositories/auth-link-repository";
import { AuthenticateLink } from "@/use-cases/auth/authenticate-link";

export function makeAuthenticateLinkUseCase() {
	const authLinkRepository = new AuthLinkRepository();
	const authenticateLinkUseCase = new AuthenticateLink(authLinkRepository);
	return authenticateLinkUseCase;
}
