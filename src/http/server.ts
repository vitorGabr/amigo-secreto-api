import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { addEventParticipants } from "./routes/add-event-participants";
import { authenticateFromLink } from "./routes/authenticate-from-link";
import { createEvent } from "./routes/create-event";
import { generatePairings } from "./routes/generate-parings";
import { registerUser } from "./routes/register-user";
import { sendAuthenticationLink } from "./routes/send-authentication-link";
import { signOut } from "./routes/sign-out";

const app = new Elysia()
	.use(swagger())
	.use(addEventParticipants)
	.use(authenticateFromLink)
	.use(createEvent)
	.use(generatePairings)
	.use(sendAuthenticationLink)
	.use(signOut)
	.use(registerUser);

app.listen(3333, () => {
	console.log("🛸 HTTP server running!");
});
