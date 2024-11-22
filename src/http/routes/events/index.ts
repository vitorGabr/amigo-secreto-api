import Elysia from "elysia";
import { createEvent } from "./create-event";
import { deleteEvent } from "./delete-event";
import { getEventById } from "./get-event-by-id";
import { updateEvent } from "./update-event";

export const eventsRoutes = new Elysia({
	tags: ["Events"],
})
	.use(getEventById)
	.use(createEvent)
	.use(updateEvent)
	.use(deleteEvent);
