// routes/AuthPagesGuard.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { getRedirectIntent } from "../utils/redirectIntent";
import AuthPageGate from "./AuthPageGate";

const AUTH_PAGES = new Set(["/login", "/register", "/forgotpwd"]);

function isGuestFlag() {
	try {
		return localStorage.getItem("guest") === "true";
	} catch {
		return false;
	}
}
/**
 * Use this ONLY to wrap your auth pages (login/register/forgotpwd).
 * It centralises the "checking", "signing out", and "redirect intent"
 * holds, and does the "already logged-in? -> /dashboard" redirect.
 */
export default function AuthPagesGuard({ children }) {
	const { user, userState, isLogoutTransitioning } = useAuth();
	const { pathname } = useLocation();

	if (!AUTH_PAGES.has(pathname)) return children;

	// If user explicitly chose Guest, let them see the auth page.
	// We'll clear this flag on successful login.
	if (isGuestFlag()) return children;

	// If we have an OAuth redirect to finish, show "Signing you in…"
	if (getRedirectIntent()) {
		return <AuthPageGate state="signing-in" />;
	}

	// If user is already logged in, bounce them away from auth pages.
	if (userState === "loggedIn" && user?.uid) {
		return <Navigate to="/dashboard" replace />;
	}

	// While auth is resolving on a cold load / refresh.
	if (userState === "checking") {
		return <AuthPageGate state="checking-auth" />;
	}
	// If a sign-out flow is in progress (your existing flag), show unified copy.
	if (isLogoutTransitioning) {
		return <AuthPageGate state="signing-out" />;
	}

	return children;
}
