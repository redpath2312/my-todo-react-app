import { useUI } from "../UIContext";

const MESSAGES = {
	"checking-auth": "Checking sign-in…",
	"loading-app": "Loading…",
	"signing-in": "Signing you in…",
	"signing-out": "Signing out…",
	"switching-to-guest": "Switching to guest mode…",
	default: "Loading…",
};

/**
 * Full-page holding UI.
 * - Prefer passing an explicit `state` prop.
 * - If omitted, it will fall back to UIContext.transitionState (optional).
 */

export default function AuthPageGate({ state }) {
	const { transitionState } = useUI() ?? {};
	const current = state || transitionState || "default";

	return (
		<main
			role="status"
			aria-busy="true"
			className="min-h-[40vh] p-6 grid place-items-center"
		>
			<p>{MESSAGES[current] ?? MESSAGES.default}</p>
		</main>
	);
}
