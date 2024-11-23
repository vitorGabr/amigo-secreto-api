import { resend } from "../client";
import GiftAssignmentEmail from "../template/gift-assignment-email";

type Match = { name: string; id: string; email: string };
type SendMatchingParticipantsEmail = {
	matches: {
		giver: Match;
		receiver: Match;
	}[];
	eventName: string;
	ownerName: string;
	budget?: number;
	exchangeDate?: Date;
	description?: string;
};

export async function sendMatchingParticipantsEmail(
	data: SendMatchingParticipantsEmail,
) {
	await resend.batch.send(
		data.matches.map((participant) => ({
			from: "Acme <onboarding@resend.dev>",
			to: participant.giver.email,
			subject: "Amigo Secreto",
			react: GiftAssignmentEmail({
				participantName: participant.giver.name,
				recipientName: participant.receiver.name,
				eventName: data.eventName,
				ownerName: data.ownerName,
				budget: data.budget,
				eventDate: data.exchangeDate,
				description: data.description,
			}),
		})),
	);
}
