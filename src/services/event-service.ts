import { prisma } from "@/lib/prisma";

type Event = { name: string };

class EventService {
	async createEvent(event: Event) {
		const response = await prisma.event.create({
			data: { name: event.name },
			select: {
				id: true,
			},
		});

		return response;
	}

	async getEvent(eventId: number) {
		const response = await prisma.event.findFirst({
			where: { id: eventId },
			select: {
				id: true,
				name: true,
			},
		});

		return response;
	}

	async updateEvent(eventId: number, event: Event) {
		const response = await prisma.event.update({
			where: { id: eventId },
			data: { name: event.name },
			select: {
				id: true,
			},
		});

		return response;
	}

	async deleteEvent(eventId: number) {
		await prisma.event.delete({
			where: { id: eventId },
		});
	}
}

export const eventService = new EventService();
