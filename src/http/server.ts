import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoutes } from "./routes/auth";
import { eventsRoute } from "./routes/events";
import { matchesRoute } from "./routes/matches";
import { usersRoute } from "./routes/users";

const app = new Elysia()
	.use(swagger())
	.use(authRoutes)
	.use(eventsRoute)
	.use(matchesRoute)
	.use(usersRoute);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
