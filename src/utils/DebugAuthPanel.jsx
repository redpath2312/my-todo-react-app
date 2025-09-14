// DebugAuthPanel.jsx
import { auth } from "../firebaseconfig";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const KEY = "pendingRedirect",
	TS = "pendingRedirectAt",
	TTL = 15000;
const getIntent = () => {
	const n = sessionStorage.getItem(KEY);
	const at = Number(sessionStorage.getItem(TS) || 0);
	return n && Date.now() - at < TTL ? n : null;
};

export default function DebugAuthPanel({ userState }) {
	const loc = useLocation();
	const [intent, setIntent] = useState(getIntent());

	useEffect(() => {
		const id = setInterval(() => setIntent(getIntent()), 300);
		return () => clearInterval(id);
	}, []);

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
				<b>Path:</b> {loc.pathname}
			</div>
			<div>
				<b>State:</b> {userState}
			</div>
			<div>
				<b>Intent:</b> {String(intent || "—")}
			</div>
			<div>
				<b>auth.currentUser:</b> {auth.currentUser ? "yes" : "no"}
			</div>
			<div>
				<b>UID:</b> {auth.currentUser?.uid || "—"}
			</div>
		</div>
	);
}
