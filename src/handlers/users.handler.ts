import type { CreateUserDto } from "@/dtos/users";
import { userRepository } from "@/repositories/user.repository";

export async function createUser(data: CreateUserDto) {
	return userRepository.create(data);
}
