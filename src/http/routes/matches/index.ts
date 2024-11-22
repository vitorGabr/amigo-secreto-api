import Elysia from "elysia";
import { generateMatches } from "./generate-matches";

export const matchesRoutes = new Elysia({
	tags: ["Matches"],
}).use(generateMatches);
