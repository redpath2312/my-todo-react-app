// DebugAuthPanel.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getAuthClient } from "../firebaseAuthClient";

const KEY = "pendingRedirect",
	TS = "pendingRedirectAt",
	TTL = 15000;
const getIntent = () => {
	const n = sessionStorage.getItem(KEY);
	const at = Number(sessionStorage.getItem(TS) || 0);
	return n && Date.now() - at < TTL ? n : null;
};

export default function DebugAuthPanel({ userState }) {
	const { pathname } = useLocation();
	const [intent, setIntent] = useState(getIntent());

	// live auth info (lazy)
	const [authInfo, setAuthInfo] = useState({
		hasAuthUser: false,
		uid: null,
		email: null,
		name: null,
	});

	useEffect(() => {
		const id = setInterval(() => setIntent(getIntent()), 300);
		return () => clearInterval(id);
	}, []);

	useEffect(() => {
		let alive = true;
		let unsub;

		(async () => {
			try {
				const auth = await getAuthClient();
				const { onAuthStateChanged } = await import("firebase/auth");

				// seed immediately
				const u = auth.currentUser;
				if (alive) {
					setAuthInfo({
						hasAuthUser: !!u,
						uid: u?.uid ?? null,
						email: u?.email ?? null,
						name: u?.displayName ?? null,
					});
				}

				unsub = onAuthStateChanged(auth, (user) => {
					if (!alive) return;
					setAuthInfo({
						hasAuthUser: !!user,
						uid: user?.uid ?? null,
						email: user?.email ?? null,
						name: user?.displayName ?? null,
					});
				});
			} catch (e) {
				// optional: surface in panel
				if (alive) {
					setAuthInfo((s) => ({ ...s, error: e?.message || String(e) }));
				}
			}
		})();

		return () => {
			alive = false;
			if (unsub) unsub();
		};
	}, []);

	// Hide outside dev if you want:
	if (import.meta.env.PROD) return null;

	return (
		<div
			style={{
				position: "fixed",
				bottom: 8,
				right: 8,
				fontSize: 12,
				background: "rgba(0,0,0,0.7)",
				color: "#fff",
				padding: "8px 10px",
				borderRadius: 8,
				zIndex: 99999,
			}}
		>
			<div>
				<b>Path:</b> {pathname}
			</div>
			<div>
				<b>State:</b> {userState}
			</div>
			<div>
				<b>Intent:</b> {String(intent || "—")}
			</div>
			<div>
				<b>auth.currentUser:</b> {authInfo.hasAuthUser ? "yes" : "no"}
			</div>
			<div>
				<b>UID:</b> {authInfo.uid || "—"}
			</div>
			<div>
				<b>Name:</b> {authInfo.name || "—"}
			</div>
			<div>
				<b>Email:</b> {authInfo.email || "—"}
			</div>
			{authInfo.error && (
				<div style={{ color: "#f88" }}>
					<b>Auth err:</b> {authInfo.error}
				</div>
			)}
		</div>
	);
}
