import type { CreateUserDto } from "@/dtos/users";
import { prisma } from "@/lib/prisma";

class UserRepository {
	async create(user: CreateUserDto) {
		await prisma.user.upsert({
			where: {
				email: user.email,
			},
			update: {},
			create: user,
		});
	}
}

export const userRepository = new UserRepository();
