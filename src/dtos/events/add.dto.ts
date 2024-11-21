export interface AddEventDTO {
	userId: string;
	event: string;
	participants: {
		name: string;
		email: string;
	}[];
}
