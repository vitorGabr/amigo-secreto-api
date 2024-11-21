import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { sendMatchingParticipantsEmail } from "@/mails/handlers/send-matching-participants-email";
import { eventRepository } from "@/repositories/event";
import { userRepository } from "@/repositories/user";

class MatchedUseCases {
	async generate(data: {
		eventId: number;
		userId: string;
	}) {
        const [event, participants] = await Promise.all([
            eventRepository.get(data.eventId, data.userId),
            userRepository.findManyByEventParticipation(data.eventId)
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

export const matchesUseCases = new MatchedUseCases();
