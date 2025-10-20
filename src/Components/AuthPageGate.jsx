// Components/AuthPageGate.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getRedirectIntent } from "../utils/redirectIntent";

const AUTH_PAGES = new Set(["/login", "/register", "/forgotpwd"]);

function isGuestFlag() {
	try {
		return localStorage.getItem("guest") === "true";
	} catch {
		return false;
	}
}

export default function AuthPageGate({ children }) {
	const { user, userState, isLogoutTransitioning } = useAuth();
	const { pathname } = useLocation();

	if (!AUTH_PAGES.has(pathname)) return children;

	// If user explicitly chose Guest, let them see the auth page.
	// We'll clear this flag on successful login.
	if (isGuestFlag()) return children;

	if (getRedirectIntent()) {
		return <div style={{ padding: 16 }}>Signing you in…</div>;
	}
	if (userState === "checking") {
		return <div style={{ padding: 16 }}>Loading…</div>;
	}
	if (userState === "loggedIn" && user?.uid) {
		return <Navigate to="/dashboard" replace />;
	}
	if (isLogoutTransitioning) {
		return <div style={{ padding: 16 }}>Signing out…</div>;
	}

	return children;
}
