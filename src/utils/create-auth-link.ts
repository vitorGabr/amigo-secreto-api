export function createAuthLink(code: string) {
	const authLink = new URL(
		"/auth-links/authenticate",
		`${process.env.API_BASE_URL}`,
	);
	authLink.searchParams.set("code", code);
	return authLink;
}
