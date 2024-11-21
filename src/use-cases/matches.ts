import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { sendMatchingParticipantsEmail } from "@/mails/handlers/send-matching-participants-email";
import { eventRepository } from "@/repositories/event";
import { matchRepository } from "@/repositories/match";
import { userRepository } from "@/repositories/user";

class MatchedUseCases {
	async generate(data: {
		eventId: number;
		userId: string;
	}) {
		const event = await eventRepository.get(data.eventId, data.userId);
		if (!event) throw new UnauthorizedError();

		const participants = await userRepository.findManyByEventParticipation(
			data.eventId,
		);
		if (participants.length < 2) {
			throw new Error("Not enough participants in group");
		}

		const suffledParticipants = participants.sort(() => Math.random() - 0.5);
		const matches = suffledParticipants.map((participant, index) => {
			const nextParticipant = participants[index + 1] || participants[0];
			return {
				giver: participant,
				receiver: nextParticipant,
			};
		});
		await matchRepository.createMany(
			matches.map((match) => ({
				eventId: event.id,
				giverId: match.giver.id,
				receiverId: match.receiver.id,
			})),
		);
		sendMatchingParticipantsEmail(matches, event.name);
	}
}

export const matchesUseCases = new MatchedUseCases();
