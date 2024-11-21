import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authRoute } from "./routes/auth";
import { eventsRoute } from "./routes/events";
import { paringsRoute } from "./routes/parings";
import { usersRoute } from "./routes/users";

const app = new Elysia()
	.use(swagger())
	.use(usersRoute)
	.use(eventsRoute)
	.use(paringsRoute)
	.use(authRoute);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
