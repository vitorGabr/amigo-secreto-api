import { prisma } from "@/lib/prisma";
import Elysia, { t } from "elysia";
import { authentication } from "../authentication";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const generatePairings = new Elysia().use(authentication).get(
	"/events/:eventId/pairings",
	async ({ params, getCurrentUser, set }) => {
		const { sub } = await getCurrentUser();
		const event = await prisma.event.findFirst({
			where: {
				id: params.eventId,
				ownerId: sub,
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

		const shuffledParticipants = participants.sort(() => Math.random() - 0.5);
		const matches = shuffledParticipants.map((participant, index) => {
			const nextParticipant = participants[index + 1] || participants[0];
			return {
				giver: participant,
				reciver: nextParticipant,
			};
		});

		// await resend.batch.send(
		// 	matches.map((participant) => ({
		// 		from: "Acme <onboarding@resend.dev>",
		// 		to: participant.giver.email,
		// 		subject: "Amigo Secreto",
		// 		react: GiftAssignmentEmail({
		// 			participantName: participant.reciver.name,
		// 			recipientName: participant.giver.name,
		// 			eventName: event.name,
		// 		}),
		// 	})),
		// );

		await prisma.match.createMany({
			data: matches.map((match) => ({
				eventId: event.id,
				giverId: match.giver.id,
				receiverId: match.reciver.id,
			})),
		});

		set.status = 201;
	},
	{
		params: t.Object({
			eventId: t.Number(),
		}),
	},
);
