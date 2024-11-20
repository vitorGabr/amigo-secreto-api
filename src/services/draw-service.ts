import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { GiftAssignmentEmail } from "@/emails/gift-assignment-email";
import { eventService } from "./event-service";
import { NotFoundError } from "elysia";

type Participant = {
	id: string;
	name: string;
	email: string;
};

class DrawService {
	private async findParticipantsByEventId(eventId: number) {
		const response = await prisma.participant.findMany({
			where: {
				eventParticipant: {
					some: {
						eventId,
					},
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		});

		return response;
	}

	private generateMatches(participants: Participant[]) {
		const shuffledParticipants = participants.sort(() => Math.random() - 0.5)
		return shuffledParticipants.map((participant, index) => {
			const nextParticipant = participants[index + 1] || participants[0];
			return {
				giver: participant,
				reciver: nextParticipant,
			};
		});
	}

	private async notify(
		data: {
			giver: Participant;
			reciver: Participant;
		}[],
		eventName: string,
	) {
		await resend.batch.send(
			data.map((participant) => ({
				from: "Acme <onboarding@resend.dev>",
				to: "macstudios.info@gmail.com",
				subject: "Amigo Secreto",
				react: GiftAssignmentEmail({
					participantName: participant.reciver.name,
					recipientName: participant.giver.name,
					eventName: eventName,
				}),
			})),
		);
	}

	async execute(eventId: number) {
		const event = await eventService.getEvent(eventId);
		if (!event) throw new NotFoundError();
		const participants = await this.findParticipantsByEventId(eventId);
		if (participants.length < 2) {
			throw new Error("Not enough participants in group");
		}

		const matches = this.generateMatches(participants);
		this.notify(matches, event.name);

		await prisma.match.createMany({
			data: matches.map((match) => ({
				eventId: eventId,
				giverId: match.giver.id,
				receiverId: match.reciver.id,
			})),
		});
	}
}

export const drawService = new DrawService();
