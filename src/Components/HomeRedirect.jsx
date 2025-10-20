import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function HomeRedirect() {
	const { userState, user, isLogoutTransitioning } = useAuth();

	if (isLogoutTransitioning) {
		return <div style={{ padding: 16 }}>Signing out…</div>;
	}

	if (userState === "checking") {
		return <div style={{ padding: 16 }}>Loading…</div>;
	}
	if (userState === "loggedIn" && user?.uid)
		return <Navigate to="/dashboard" replace />;
	if (userState === "guest") return <Navigate to="/guest" replace />;
	// if (user) return <Navigate to="/dashboard" replace />;
	return <Navigate to="/login" replace />;
}
