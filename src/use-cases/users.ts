import { userRepository } from "@/repositories/user";
import type { Prisma } from "@prisma/client";

class UsersUseCases {
	async create(data: Prisma.UserCreateInput) {
		return userRepository.create(data);
	}
}

export const usersUseCases = new UsersUseCases();
