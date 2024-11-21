export interface UpdateEventDTO {
	userId: string;
	eventId: number;
	participants: {
		name: string;
		email: string;
	}[];
}
