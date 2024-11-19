export function isValidCuid(value: string) {
	const cuidRegex = /^c[^\s-]{24,}$/; // Padrão típico de um CUID
	return typeof value === "string" && cuidRegex.test(value);
}
