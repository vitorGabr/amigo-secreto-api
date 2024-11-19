import { Elysia } from "elysia";
import { createSecretSantaEvent } from "./routes/create-secret-santa-event";
import { generatePairings } from "./routes/generate-pairings";
import { getSecretFriend } from "./routes/get-secret-friend";

const app = new Elysia()
	.use(createSecretSantaEvent)
	.use(generatePairings)
	.use(getSecretFriend);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
