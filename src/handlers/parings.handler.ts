import type { GeneratePairingsDto } from "@/dtos/parings/generate.dto";
import { paringRepository } from "@/repositories/paring.repository";

export async function generateParings(data: GeneratePairingsDto) {
	return paringRepository.generate(data);
}
