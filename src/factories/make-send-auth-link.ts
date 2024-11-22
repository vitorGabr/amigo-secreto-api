import { AuthLinkRepository } from "@/repositories/auth-link-repository";
import { UserRepository } from "@/repositories/user-repository";
import { SendAuthLink } from "@/use-cases/auth/send-auth-link";

export function makeSendAuthLinkUseCase() {
	const authLinkRepository = new AuthLinkRepository();
	const userRepository = new UserRepository();
	const sendAuthLinkUseCase = new SendAuthLink(
		authLinkRepository,
		userRepository,
	);
	return sendAuthLinkUseCase;
}
