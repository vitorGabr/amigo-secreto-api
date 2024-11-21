import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

class UserRepository {
	async create(user: Prisma.UserCreateInput) {
		return prisma.user.upsert({
			where: {
				email: user.email,
			},
			update: {},
			create: user,
		});
	}

	async findByEmail(email: string) {
		return prisma.user.findFirst({
			where: {
				email,
			},
		});
	}

	async findManyByEventParticipation(eventId: number) {
		return prisma.user.findMany({
			where: {
				eventParticipations: {
					some: {
						eventId,
					},
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		});
	}

	async upsertMany(users: Prisma.UserCreateInput[]) {
		const upsertOperations = users.map((user) =>
			prisma.user.upsert({
				create: user,
				update: {},
				where: { email: user.email },
				select: {
					id: true,
				},
			}),
		);

		return prisma.$transaction(upsertOperations);
	}
}

export const userRepository = new UserRepository();
