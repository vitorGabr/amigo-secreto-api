import type { AuthenticateFromLinkDto, SendLinkDTO } from "@/dtos/auth";
import { authenticateRepository } from "@/repositories/authenticate.repository";

export async function sendAuthLink(data: SendLinkDTO) {
	return authenticateRepository.sendAuthLink(data);
}

export async function authenticateFromLink(data: AuthenticateFromLinkDto) {
	return authenticateRepository.authenticateFromLink(data);
}
