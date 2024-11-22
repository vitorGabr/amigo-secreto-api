import { UserRepository } from "@/repositories/user-repository";
import { CreateUser } from "@/use-cases/user/create-user";

export function makeCreateUserUseCase() {
	const userRepository = new UserRepository();
	const createUserUseCase = new CreateUser(userRepository);
	return createUserUseCase;
}
