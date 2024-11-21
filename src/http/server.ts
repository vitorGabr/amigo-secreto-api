import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";
import { eventsRoute } from "./routes/events";
import { matchesRoute } from "./routes/matches";
import { eventParticipantsRoute } from "./routes/event-participants";

const app = new Elysia()
	.use(swagger())
	.use(authRoutes)
	.use(eventsRoute)
	.use(eventParticipantsRoute)
	.use(matchesRoute);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
