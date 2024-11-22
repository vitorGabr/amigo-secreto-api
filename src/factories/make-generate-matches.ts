import { EventRepository } from "@/repositories/event-repository";
import { MatchRepository } from "@/repositories/match-repository";
import { UserRepository } from "@/repositories/user-repository";
import { GenerateMatches } from "@/use-cases/match/generate-matches";

export function makeGenerateMatchesUseCase() {
	const eventRepository = new EventRepository();
	const userRepository = new UserRepository();
	const matchRepository = new MatchRepository();
	const generateMatchesUseCase = new GenerateMatches(
		eventRepository,
		userRepository,
		matchRepository,
	);
	return generateMatchesUseCase;
}
