import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import { useLocation } from "react-router";

import { useAuth } from "./AuthContext";
import ForgotPwd from "./ForgotPwd";

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

	if (userState === "checking") {
		return <div>Loading...</div>;
	}

	return (
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
					userState === "loggedIn" ? <Navigate to="/dashboard" /> : <Login />
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
		</Routes>
	);
}

export default App;
