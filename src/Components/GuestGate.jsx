// routes/GuestGate.jsx
import { useEffect } from "react";
import { useAuth } from "../AuthContext";

export default function GuestGate({ children }) {
	const { userState, handleGuestSignIn } = useAuth();

	// If a signed-in user types /guest, convert to guest (signOut + flag)
	useEffect(() => {
		if (userState === "loggedIn" || userState === "loggedOut") {
			void handleGuestSignIn(); // signs out if needed, sets localStorage 'guest', sets userState='guest'
		}
	}, [userState, handleGuestSignIn]);

	// IMPORTANT: never return null during the transition
	// While we’re converting (or resolving), show a small placeholder (never return null)
	if (
		userState === "checking" ||
		userState === "loggedIn" ||
		userState === "loggedOut"
	) {
		return <div style={{ padding: 16 }}>Switching to Guest…</div>;
	}

	// Now in guest mode → render the page (Header will see userState === 'guest')
	return children;
}
