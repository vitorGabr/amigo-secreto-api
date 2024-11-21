import { UnauthorizedError } from "@/http/errors/unauthorized-error";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

class EventRepository {
	async get(eventId: number, userId: string) {
		const event = await prisma.event.findFirst({
			where: { id: eventId, ownerId: userId },
			select: {
				id: true,
				name: true,
				budget: true,
				exchangeDate: true,
				description: true,
				owner: {
					select: {
						name: true,
					},
				},
			},
		});
		if (!event) throw new UnauthorizedError();

		return event;
	}

	async create(data: Prisma.EventUncheckedCreateInput) {
		return prisma.event.create({
			data: data,
			select: {
				id: true,
			},
		});
	}

	async findFirst(data: { id: number; ownerId: string }) {
		return prisma.event.findFirst({ where: data, select: { id: true } });
	}

	async update(id: number, data: Prisma.EventUpdateInput) {
		return prisma.event.update({
			where: { id: id },
			data,
		});
	}

	async delete(eventId: number) {
		await prisma.event.delete({ where: { id: eventId } });
	}
}

export const eventRepository = new EventRepository();
