import Elysia from "elysia";
import { addParticipantsToEvent } from "./add-participants-to-event";

export const eventParticipantsRoutes = new Elysia({
	tags: ["Event Participants"],
}).use(addParticipantsToEvent);
