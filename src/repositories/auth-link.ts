import { prisma } from "@/lib/prisma";
import { resend } from "@/mails/client";
import { AuthenticationMagicLinkTemplate } from "@/mails/template/authentication-magic-link";
import type { Prisma } from "@prisma/client";

class AuthLinkRepository {
	async create(data: Prisma.AuthLinkUncheckedCreateInput) {
		return prisma.authLink.create({
			data,
		});
	}

	async findByCode(code: string) {
		return prisma.authLink.findFirst({
			where: {
				code,
			},
		});
	}

	async delete(id: number) {
		return prisma.authLink.delete({
			where: {
				id,
			},
		});
	}
}

export const authLinkRepository = new AuthLinkRepository();
