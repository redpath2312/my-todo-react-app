import { useMemo } from "react";
import { buildFeedbackMailto } from "../utils/feedbackMailto";
import { APP_VERSION } from "../version";
import { useAuth } from "../AuthContext";

export default function ContactLink({
	to = "dashtasker.help@outlook.com", // ← put your new jobs/support email here
	label = "Feedback / Contact",
	className = "",
}) {
	const { user } = useAuth?.() ?? { user: null };
	const route = typeof window !== "undefined" ? window.location.pathname : "/";
	const href = useMemo(
		() =>
			buildFeedbackMailto({
				to,
				uid: user?.uid ?? null,
				route,
				appVersion: APP_VERSION,
			}),
		[to, user?.uid, route]
	);

	return (
		<a
			href={href}
			className={className}
			rel="noopener"
			aria-label="Send feedback via email"
		>
			{label}
		</a>
	);
}
