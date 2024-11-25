export class NotAOwnerError extends Error {
	constructor() {
		super("User is not a event owner.");
	}
}
