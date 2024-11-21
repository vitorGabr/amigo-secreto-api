import { resend } from "../client";
import { GiftAssignmentEmail } from "../template/gift-assignment-email";

type User = { name: string; id: string; email: string };
type Math = {
	giver: User;
	receiver: User;
};
export async function sendMatchingParticipantsEmail(
	matches: Math[],
	eventName: string,
) {
	await resend.batch.send(
		matches.map((participant) => ({
			from: "Acme <onboarding@resend.dev>",
			to: participant.giver.email,
			subject: "Amigo Secreto",
			react: GiftAssignmentEmail({
				participantName: participant.receiver.name,
				recipientName: participant.giver.name,
				eventName,
			}),
		})),
	);
}
