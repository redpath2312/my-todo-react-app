// AuthCallback.jsx
import { useEffect, useRef } from "react";
// import { getRedirectResult } from "firebase/auth";
// import { auth } from "./firebaseconfig";
import { getAuthClient } from "./firebaseAuthClient";
import { useAlert } from "./ErrorContext";
// import { clearRedirectIntent } from "./utils/redirectIntent";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
	const { addAlert } = useAlert();
	const navigate = useNavigate();
	const addAlertRef = useRef(addAlert);

	useEffect(() => {
		addAlertRef.current = addAlert;
	}, [addAlert]);

	useEffect(() => {
		let alive = true;

		(async () => {
			const auth = await getAuthClient(); //lazy
			const { getRedirectResult } = await import("firebase/auth");

			try {
				const res = await getRedirectResult(auth);
				// If popup flow was used instead of redirect, res can be null — just send them on
				if (!alive) return;
				if (res?.user) {
					addAlertRef.current?.(
						`Signed in as ${res.user.diaplyName || res.user.email}`,
						"success",
						3000
					);

					navigate("/dashboard", { replace: true });
					return;
				}

				// No result: give auth a moment to hydrate; if still no user, treat as cancelled
				setTimeout(() => {
					if (!alive) return;
					if (!auth.currentUser) {
						// clearRedirectIntent(); optional
						addAlertRef.current?.(
							"Login was cancelled or blocked. Please try again.",
							"warning",
							5000
						);
						navigate("/login", { replace: true });
					} else {
						navigate("/dashboard", { replace: true });
					}
				}, 1500);
			} catch (err) {
				// clearRedirectIntent();
				addAlertRef.current?.(
					`Redirect login failed: [${err?.code || "unknown"}] ${
						err?.message || ""
					}`,
					"error",
					7000
				);
				navigate("/login", { replace: true });
			}
		})();

		return () => {
			alive = false;
		};
	}, [addAlert, navigate]);

	return <div style={{ padding: 16 }}>Signing you in…</div>;
}
