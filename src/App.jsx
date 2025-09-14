import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import { useLocation } from "react-router";

import { useAuth } from "./AuthContext";
import ForgotPwd from "./ForgotPwd";
import { getRedirectIntent } from "./utils/redirectIntent";
import DebugAuthPanel from "./utils/DebugAuthPanel";
import AuthCallback from "./AuthCallback";
function App({
	// userState,
	dbCards,
	addCardToDB,
	updateCardsInDB,
	deleteCardInDB,
	clearDoneCardsInDB,
	deleteAllCardsInDB,
	isAdding,
}) {
	const { user, userState } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const protectedPages = ["/dashboard", "/guest"];
		const pending = !!getRedirectIntent();

		// 🚫 do nothing while 'checking' or redirect handoff
		if (userState === "checking" || pending) return;

		if (userState === "loggedIn") {
			navigate("/dashboard", { replace: true });
		} else if (userState === "guest") {
			navigate("/guest", { replace: true });
		} else if (
			userState === "loggedOut" &&
			protectedPages.includes(location.pathname)
		) {
			navigate("/login", { replace: true });
		}
	}, [userState, location.pathname, navigate]);


	return (
		<>
			<Routes>
				<Route
					path="/"
					element={
						userState !== "loggedOut" ? (
							<Navigate to="/dashboard" />
						) : (
							<Navigate to="/login" />
						)
					}
				/>
				<Route
					path="/dashboard"
					element={
						<Dashboard
							dbCards={dbCards}
							addCardToDB={addCardToDB}
							updateCardsInDB={updateCardsInDB}
							deleteCardInDB={deleteCardInDB}
							clearDoneCardsInDB={clearDoneCardsInDB}
							deleteAllCardsInDB={deleteAllCardsInDB}
							isAdding={isAdding}
						/>
					}
				/>
				<Route
					path="/login"
					element={
						getRedirectIntent() ? (
							<div style={{ padding: 16 }}>Signing you in…</div>
						) : userState === "loggedIn" ? (
							<Navigate to="/dashboard" />
						) : (
							<Login />
						)
					}
				/>
				<Route
					path="/guest"
					element={
						userState === "guest" && (
							<Dashboard
								addCardToDB={addCardToDB}
								updateCardsInDB={updateCardsInDB}
								deleteCardInDB={deleteCardInDB}
								clearDoneCardsInDB={clearDoneCardsInDB}
								deleteAllCardsInDB={deleteAllCardsInDB}
								isAdding={isAdding}
							/>
						)
					}
				/>
				<Route path="/register" element={<Register />} />
				<Route path="/forgotpwd" element={<ForgotPwd />} />
				<Route path="/auth/callback" element={<AuthCallback />} />
			</Routes>

			{/* Fixed overlay, always visible on every page */}
			{import.meta.env.DEV && (
				<DebugAuthPanel userState={userState} user={user} />
			)}
		</>
	);
}

export default App;
