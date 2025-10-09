import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./AuthContext";
import { getRedirectIntent } from "./utils/redirectIntent";
// import DebugAuthPanel from "./utils/DebugAuthPanel";

// lazy pages
const Dashboard = lazy(() => import("./Dashboard"));
const Login = lazy(() => import("./Login"));
const Register = lazy(() => import("./Register"));
const ForgotPwd = lazy(() => import("./ForgotPwd"));
const AuthCallback = lazy(() => import("./AuthCallback"));

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
	const { userState, handleGuestSignIn } = useAuth();

	const { pathname } = useLocation();

	useEffect(() => {
		const pending = !!getRedirectIntent();

		// 🚫 do nothing while 'checking' or redirect handoff
		if (
			pathname === "/guest" &&
			userState !== "guest" &&
			userState !== "loggedIn" &&
			userState !== "checking" &&
			!pending
		) {
			handleGuestSignIn();
		}
	}, [pathname, userState, handleGuestSignIn]);

	return (
		<>
			<Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
				<Routes>
					<Route
						path="/"
						element={
							userState === "loggedIn" ? (
								<Navigate to="/dashboard" />
							) : userState === "guest" ? (
								<Navigate to="/guest" />
							) : (
								<Navigate to="/login" />
							)
						}
					/>
					<Route
						path="/dashboard"
						element={
							userState === "loggedIn" ? (
								<Dashboard
									dbCards={dbCards}
									addCardToDB={addCardToDB}
									updateCardsInDB={updateCardsInDB}
									deleteCardInDB={deleteCardInDB}
									clearDoneCardsInDB={clearDoneCardsInDB}
									deleteAllCardsInDB={deleteAllCardsInDB}
									isAdding={isAdding}
								/>
							) : (
								<Navigate to="/login" replace />
							)
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
							// userState === "guest" && (
							<Dashboard
								addCardToDB={addCardToDB}
								updateCardsInDB={updateCardsInDB}
								deleteCardInDB={deleteCardInDB}
								clearDoneCardsInDB={clearDoneCardsInDB}
								deleteAllCardsInDB={deleteAllCardsInDB}
								isAdding={isAdding}
							/>
							// )
						}
					/>
					<Route path="/register" element={<Register />} />
					<Route path="/forgotpwd" element={<ForgotPwd />} />
					<Route path="/auth/callback" element={<AuthCallback />} />
				</Routes>

				{/* Fixed overlay, always visible on every page */}
				{/* Debug AuthPanel if needed*/}
				{/* {import.meta.env.DEV && (
				<DebugAuthPanel userState={userState} user={user} />
			)} */}
			</Suspense>
		</>
	);
}

export default App;
