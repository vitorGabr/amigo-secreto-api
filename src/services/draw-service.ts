import { db } from "@/lib/db";
import { participantService } from "./participant-service";

type Participant = string;

class DrawService {
	private generateSuflledParticipants(participants: Participant[]) {
		return participants.sort(() => Math.random() - 0.5);
	}

	private generateMatches(participants: Participant[]) {
		return participants.map((participant, index) => {
			const nextParticipant = participants[index + 1] || participants[0];
			return {
				giver: participant,
				reciver: nextParticipant,
			};
		});
	}

	async execute(eventId: number) {
		const participants =
			await participantService.findParticipantsByEventId(eventId);

		if (participants.length < 2) {
			throw new Error("Not enough participants in group");
		}

		const shuffledParticipants = this.generateSuflledParticipants(participants);
		const matches = this.generateMatches(shuffledParticipants);

		await db.match.createMany({
			data: matches.map((match) => ({
				eventId: eventId,
				giverId: match.giver,
				receiverId: match.reciver,
			})),
		});
	}
}

export const drawService = new DrawService();
