import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { addParticipantsToEvent } from "./routes/event-participants/add-participants-to-event";
import { createEvent } from "./routes/events/create-event";
import { deleteEvent } from "./routes/events/delete-event";
import { getEventById } from "./routes/events/get-event-by-id";
import { updateEvent } from "./routes/events/update-event";
import { generateMatches } from "./routes/matches/generate-matches";
import { authenticateLink } from "./routes/user/authenticate-link";
import { createUser } from "./routes/user/create-user";
import { sendAuthLink } from "./routes/user/send-auth-link";

const app = new Elysia()
	.use(swagger())
	.use(addParticipantsToEvent)
	.use(createEvent)
	.use(deleteEvent)
	.use(getEventById)
	.use(updateEvent)
	.use(generateMatches)
	.use(authenticateLink)
	.use(createUser)
	.use(sendAuthLink);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
