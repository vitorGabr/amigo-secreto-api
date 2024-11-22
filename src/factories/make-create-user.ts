import { UserRepository } from "@/repositories/user-repository";
import { CreateUser } from "@/use-cases/auth/create-user";

export function makeCreateUserUseCase() {
	const userRepository = new UserRepository();
	const createUserUseCase = new CreateUser(userRepository);
	return createUserUseCase;
}
