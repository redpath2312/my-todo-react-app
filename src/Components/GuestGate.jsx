// routes/GuestGate.jsx
import { useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import AuthPageGate from "./AuthPageGate";
import { useUI } from "../UIContext";

export default function GuestGate({ children }) {
	const { userState, handleGuestSignIn } = useAuth();
	const { withTransition } = useUI();
	const kickedOff = useRef(false);

	useEffect(() => {
		if (kickedOff.current) return;
		// From loggedIn or loggedOut → hop to guest with a unified gate label
		if (userState === "loggedIn" || userState === "loggedOut") {
			kickedOff.current = true;
			void withTransition("switching-to-guest", handleGuestSignIn);
		}
	}, [userState, withTransition, handleGuestSignIn]);

	// One consistent message for all non-guest states (includes initial "checking")
	if (userState !== "guest") {
		return <AuthPageGate state="switching-to-guest" />;
	}

	return children;
}
