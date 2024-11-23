import { NotAOwnerError } from "@/http/errors/not-a-owner-error";
import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import type { EventParticipantsRepository } from "@/repositories/event-participants-repository";
import type { EventRepository } from "@/repositories/event-repository";
import type { UserRepository } from "@/repositories/user-repository";
import type { Prisma } from "@prisma/client";

export class AddParticipantsToEvent {
	constructor(
		private eventRepository: EventRepository,
		private eventParticipantRepository: EventParticipantsRepository,
		private userRepository: UserRepository,
	) {}

	async execute(data: {
		eventId: number;
		ownerId: string;
		participants: Prisma.UserCreateInput[];
	}) {
		const [event, participantsResult] = await Promise.all([
			this.eventRepository.get(data.eventId, data.ownerId),
			this.userRepository.upsertMany(data.participants),
		]);
		if (!event) throw new NotAOwnerError();
		await this.eventParticipantRepository.createMany(
			participantsResult.map((participant) => {
				return {
					eventId: event.id,
					userId: participant.id,
				};
			}),
		);
		return { participants: participantsResult };
	}
}
