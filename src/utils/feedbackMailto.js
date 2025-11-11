// src/utils/feedbackMailto.js
export function buildFeedbackMailto({
	to,
	uid,
	route,
	appVersion,
	verbose = false,
}) {
	const subject = `DashTasker feedback${route ? `: ${route}` : ""} (v${
		appVersion || "unknown"
	})`;

	// Put prompts first; move tech context to the bottom to keep it friendly.
	const lines = [
		"Hi DashTasker team,",
		"",
		"What did you like?",
		"- ",
		"",
		"What could be better?",
		"- ",
		"",
		"Did you hit a bug? Steps to reproduce:",
		"1) ",
		"2) ",
		"3) ",
		"",
		"---",
		verbose ? `Route: ${route || "/"}` : `Page: ${route || "/"}`,
		`User: ${uid || "guest"}`,
		`Version: ${appVersion || "unknown"}`,
		// keep UA optional; it's long
		...(verbose
			? [
					`Device: ${
						typeof navigator !== "undefined" ? navigator.userAgent : "unknown"
					}`,
			  ]
			: []),
		`Time (UTC): ${new Date().toISOString()}`,
	];

	const body = lines.join("\r\n"); // CRLF is safest across clients
	const enc = encodeURIComponent;
	return `mailto:${to}?subject=${enc(subject)}&body=${enc(body)}`;
}
