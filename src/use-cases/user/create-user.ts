import type { UserRepository } from "@/repositories/user-repository";

export class CreateUser {
	constructor(private userRepository: UserRepository) {}

	async execute(data: {
		email: string;
		name: string;
	}) {
		await this.userRepository.create(data)
	}
}
