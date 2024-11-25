import { NotAOwnerError } from "@/http/errors/not-a-owner-error";
import type { EventParticipantsRepository } from "@/repositories/event-participants-repository";
import type { EventRepository } from "@/repositories/event-repository";
import type { UserRepository } from "@/repositories/user-repository";

export class AddParticipantsToEvent {
	constructor(
		private eventRepository: EventRepository,
		private eventParticipantRepository: EventParticipantsRepository,
		private userRepository: UserRepository,
	) {}

	async execute(data: {
		eventId: number;
		ownerId: string;
		participants: { name: string; email: string }[];
	}) {
		const [event, participantsResult] = await Promise.all([
			this.eventRepository.get(data.eventId, data.ownerId),
			this.userRepository.upsertMany(data.participants),
		]);
		if (!event) throw new NotAOwnerError();
		if (!participantsResult.length) return { participants: [] };

		await this.eventParticipantRepository.createMany(
			participantsResult.map((participant) => ({
				eventId: event.id,
				userId: participant.id,
			})),
		);
		return { participants: [] };
	}
}
