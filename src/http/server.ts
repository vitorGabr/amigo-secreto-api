import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";
import { eventParticipantsRoute } from "./routes/event-participants";
import { eventsRoute } from "./routes/events";
import { matchesRoute } from "./routes/matches";

const app = new Elysia()
	.use(swagger())
	.use(authRoutes)
	.use(eventsRoute)
	.use(eventParticipantsRoute)
	.use(matchesRoute);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
