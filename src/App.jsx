import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./AuthContext";
import HomeRedirect from "./Components/HomeRedirect";
import DebugAuthPanel from "./utils/DebugAuthPanel";
import GuestGate from "./Components/guestGate";
import AuthPageGate from "./Components/AuthPageGate";

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
	const { userState, user } = useAuth();
	const isAuthDebugPanelEnabled =
		import.meta.env.DEV && import.meta.env.VITE_DEBUG_AUTH_PANEL === "true";

	// const { pathname } = useLocation();

	return (
		<>
			<Suspense fallback={<div style={{ padding: 16 }}>Loading…</div>}>
				<Routes>
					<Route path="/" element={<HomeRedirect />} />
					<Route
						path="/dashboard"
						element={
							userState === "loggedIn" && user ? (
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
							<AuthPageGate>
								<Login />
							</AuthPageGate>
							// getRedirectIntent() ? (
							// 	<div style={{ padding: 16 }}>Signing you in…</div>
							// ) : userState === "loggedIn" ? (
							// 	<Navigate to="/dashboard" />
							// ) : (
							// 	<Login />
							// )
						}
					/>
					<Route
						path="/guest"
						element={
							// userState === "guest" && (
							<GuestGate>
								<Dashboard
									addCardToDB={addCardToDB}
									updateCardsInDB={updateCardsInDB}
									deleteCardInDB={deleteCardInDB}
									clearDoneCardsInDB={clearDoneCardsInDB}
									deleteAllCardsInDB={deleteAllCardsInDB}
									isAdding={isAdding}
								/>
							</GuestGate>
							// )
						}
					/>
					<Route
						path="/register"
						element={
							<AuthPageGate>
								<Register />
							</AuthPageGate>
						}
					/>
					<Route
						path="/forgotpwd"
						element={
							<AuthPageGate>
								<ForgotPwd />
							</AuthPageGate>
						}
					/>
					<Route path="/auth/callback" element={<AuthCallback />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>

				{/* Fixed overlay, always visible on every page */}
				{/* Debug AuthPanel if needed*/}
				{isAuthDebugPanelEnabled && (
					<DebugAuthPanel userState={userState} user={user} />
				)}
			</Suspense>
		</>
	);
}

export default App;
