import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { eventParticipantsRoutes } from "./routes/event-participants";
import { eventsRoutes } from "./routes/events";
import { matchesRoutes } from "./routes/matches";
import { authRoutes } from "./routes/user";

const app = new Elysia()
	.use(swagger())
	.use(eventParticipantsRoutes)
	.use(eventsRoutes)
	.use(matchesRoutes)
	.use(authRoutes);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
