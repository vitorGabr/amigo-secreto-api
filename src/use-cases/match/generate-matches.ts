import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { sendMatchingParticipantsEmail } from "@/emails/services/send-matching-participants-email";
import type { EventRepository } from "@/repositories/event-repository";
import type { MatchRepository } from "@/repositories/match-repository";
import type { UserRepository } from "@/repositories/user-repository";

export class GenerateMatches {
	constructor(
		private eventRepository: EventRepository,
		private userRepository: UserRepository,
		private matchRepository: MatchRepository,
	) {}

	async execute(data: {
		eventId: number;
		userId: string;
	}) {
		const [event, participants] = await Promise.all([
			this.eventRepository.get(data.eventId, data.userId),
			this.userRepository.findManyByEventParticipation(data.eventId),
		]);

		if (!event) throw new UnauthorizedError();

		if (participants.length < 2) {
			throw new Error("Not enough participants in group");
		}

		participants.sort(() => Math.random() - 0.5);
		const matches = participants.map((participant, index) => {
			const nextParticipant = participants[index + 1] || participants[0];
			return {
				giver: participant,
				receiver: nextParticipant,
			};
		});

		await this.matchRepository.createMany(
			matches.map((match) => ({
				giverId: match.giver.id,
				receiverId: match.receiver.id,
				eventId: data.eventId,
			})),
		);

		sendMatchingParticipantsEmail({
			eventName: event.name,
			ownerName: event.owner.name,
			matches,
			budget: event.budget || undefined,
			exchangeDate: event.exchangeDate || undefined,
			description: event.description || undefined,
		});
	}
}
