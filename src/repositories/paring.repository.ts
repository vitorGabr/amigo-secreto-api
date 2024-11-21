import type { GeneratePairingsDto } from "@/dtos/parings/generate.dto";
import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { prisma } from "@/lib/prisma";
import { resend } from "@/mails/client";
import { GiftAssignmentEmail } from "@/mails/template/gift-assignment-email";
import { fisherYatesShuffle } from "@/utils/fisher-yates-suffle";

type User = { name: string; id: string; email: string };
type Math = {
	giver: User;
	reciver: User;
};

class ParingRepository {
	private generateMatches(participants: User[]) {
		fisherYatesShuffle(participants);
		return participants.map((participant, index) => {
			const nextParticipant = participants[index + 1] || participants[0];
			return {
				giver: participant,
				receiver: nextParticipant,
			};
		});
	}

	private async sendEmails(matches: Math[], eventName: string) {
		await resend.batch.send(
			matches.map((participant) => ({
				from: "Acme <onboarding@resend.dev>",
				to: participant.giver.email,
				subject: "Amigo Secreto",
				react: GiftAssignmentEmail({
					participantName: participant.reciver.name,
					recipientName: participant.giver.name,
					eventName,
				}),
			})),
		);
	}

	async generate({ eventId, userId }: GeneratePairingsDto) {
		const event = await prisma.event.findFirst({
			where: {
				id: eventId,
				ownerId: userId,
			},
		});
		if (!event) throw new UnauthorizedError();

		const participants = await prisma.user.findMany({
			where: {
				eventParticipations: {
					some: {
						eventId: event.id,
					},
				},
			},
			select: {
				id: true,
				name: true,
				email: true,
			},
		});

		if (participants.length < 2) {
			throw new Error("Not enough participants in group");
		}

		const matches = this.generateMatches(participants);
		await prisma.match.createMany({
			data: matches.map((match) => ({
				eventId: event.id,
				giverId: match.giver.id,
				receiverId: match.receiver.id,
			})),
		});
	}
}

export const paringRepository = new ParingRepository();
