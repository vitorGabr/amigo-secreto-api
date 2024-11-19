import { db } from "@/lib/db";

type Props = { email: string,name:string }[];

export async function upsertParticipants(participants: Props) {
	const response = await db.$transaction(
		participants.map((part) =>
			db.participant.upsert({
				create: part,
				update: {},
				where: { email: part.email },
				select: {
					id: true,
				},
			}),
		),
	);

    return response.map((participant) => participant.id);
}
