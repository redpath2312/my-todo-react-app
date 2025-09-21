// AuthCallback.jsx
import { useEffect } from "react";
import { getRedirectResult } from "firebase/auth";
import { auth } from "./firebaseconfig";
import { useAlert } from "./ErrorContext";
import { clearRedirectIntent } from "./utils/redirectIntent";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
	const { addAlert } = useAlert();
	const navigate = useNavigate();

	useEffect(() => {
		let alive = true;

		getRedirectResult(auth)
			.then((res) => {
				console.error(
					"[callback] redirect result:",
					res ? "HAS RESULT" : "NULL"
				);
				if (res?.user) {
					// onAuthStateChanged will finalize; nothing else to do
					return;
				}
				// No result: give auth a moment to hydrate; if still no user, treat as cancelled
				setTimeout(() => {
					if (!alive) return;
					if (!auth.currentUser) {
						clearRedirectIntent();
						addAlert(
							"Login was cancelled or blocked. Please try again.",
							"warning",
							5000
						);
						navigate("/login", { replace: true });
					}
				}, 1500);
			})
			.catch((e) => {
				console.error("Redirect login error", e);
				clearRedirectIntent();
				addAlert(
					`Redirect login failed: [${e?.code || "unknown"}] ${
						e?.message || ""
					}`,
					"error",
					7000
				);
				navigate("/login", { replace: true });
			});

		return () => {
			alive = false;
		};
	}, [addAlert, navigate]);

	return <div style={{ padding: 16 }}>Signing you in…</div>;
}
