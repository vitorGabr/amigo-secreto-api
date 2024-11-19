import { Elysia } from "elysia";
import { createSecretSantaEvent } from "./routes/create-secret-santa-event";
import { generatePairings } from "./routes/generate-pairings";
import { getSecretFriend } from "./routes/get-secret-friend";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
	.use(swagger())
	.use(createSecretSantaEvent)
	.use(generatePairings)
	.use(getSecretFriend);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
