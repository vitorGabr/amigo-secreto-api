export class QueryError extends Error {
	constructor(
		message: string,
		public code?: unknown,
	) {
		super(message);
	}
}
