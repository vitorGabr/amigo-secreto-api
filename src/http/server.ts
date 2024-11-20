import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { drawRoute } from "./routes/draw";
import { eventRoute } from "./routes/event";
import { participantRoute } from "./routes/participant";
import { revealRoute } from "./routes/reveal";

const app = new Elysia()
	.use(swagger())
	.use(eventRoute)
	.use(drawRoute)
	.use(revealRoute)
	.use(participantRoute);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
