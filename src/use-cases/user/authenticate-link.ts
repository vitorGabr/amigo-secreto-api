import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import type { AuthLinkRepository } from "@/repositories/auth-link-repository";
import dayjs from "dayjs";

export class AuthenticateLink {
	constructor(private authLinkRepository: AuthLinkRepository) {}

	async execute(data: { code: string }) {
		const authLinkFromCode = await this.authLinkRepository.findByCode(
			data.code,
		);

		if (
			!authLinkFromCode ||
			dayjs().diff(authLinkFromCode.createdAt, "days") > 7
		) {
			throw new UnauthorizedError();
		}

		await this.authLinkRepository.delete(authLinkFromCode.id);
		return authLinkFromCode;
	}
}
