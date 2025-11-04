import { Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import AuthPageGate from "./AuthPageGate";

export default function HomeRedirect() {
	const { userState, user, isLogoutTransitioning } = useAuth();

	if (isLogoutTransitioning) {
		return <AuthPageGate state="signing-out" />;
	}

	if (userState === "checking") {
		return <AuthPageGate state="checking-auth" />;
	}

	if (userState === "loggedIn" && user?.uid)
		return <Navigate to="/dashboard" replace />;

	if (userState === "guest") return <Navigate to="/guest" replace />;
	// if (user) return <Navigate to="/dashboard" replace />;

	if (userState === "loggedOut") {
		return <Navigate to="/login" replace />;
	}

	// Failsafe for any unexpected state
	return <AuthPageGate state="loading-app" />;
}
