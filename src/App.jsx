import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./AuthContext";
import HomeRedirect from "./Components/HomeRedirect";
import DebugAuthPanel from "./utils/DebugAuthPanel";
import GuestGate from "./Components/guestGate";
import AuthPageGate from "./Components/AuthPageGate";
import AuthPagesGuard from "./Components/AuthPagesguard";
import NotFound from "./pages/NotFounds";

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
	cardsReady,
}) {
	const { userState, user } = useAuth();
	const isAuthDebugPanelEnabled =
		import.meta.env.DEV && import.meta.env.VITE_DEBUG_AUTH_PANEL === "true";

	// const { pathname } = useLocation();

	return (
		<>
			<Suspense fallback={<AuthPageGate state="loading-app" />}>
				<Routes>
					{/* Root only */}
					<Route path="/" element={<HomeRedirect />} />

					{/* App pages */}
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
									cardsReady={cardsReady}
								/>
							) : (
								<Navigate to="/login" replace />
							)
						}
					/>
					{/* Auth pages */}
					<Route
						path="/register"
						element={
							<AuthPagesGuard>
								<Register />
							</AuthPagesGuard>
						}
					/>
					<Route
						path="/forgotpwd"
						element={
							<AuthPagesGuard>
								<ForgotPwd />
							</AuthPagesGuard>
						}
					/>
					<Route
						path="/login"
						element={
							<AuthPagesGuard>
								<Login />
							</AuthPagesGuard>
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
									cardsReady={cardsReady}
								/>
							</GuestGate>
							// )
						}
					/>
					{/* OAuth callback */}
					<Route path="/auth/callback" element={<AuthCallback />} />
					<Route path="*" element={<NotFound />} />
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
