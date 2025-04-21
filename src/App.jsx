import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Register from "./Register";
import { useLocation } from "react-router";

import { useAuth } from "./AuthContext";

function App({
	// userState,
	dbCards,
	addCardToDB,
	readCardsFromDB,
	updateCardsInDB,
	deleteCardInDB,
	clearDoneCardsInDB,
	deleteAllCardsInDB,
}) {
	const { user, userState, isAuthReady } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		const publicPages = ["/", "/login", "/register"];
		const protectedPages = ["/dashboard", "/guest"];

		if (userState === "loggedIn" && publicPages.includes(location.pathname)) {
			navigate("/dashboard");
		} else if (
			userState === "guest" &&
			publicPages.includes(location.pathname)
		) {
			navigate("/guest");
		} else if (
			userState === "loggedOut" &&
			protectedPages.includes(location.pathname)
		) {
			navigate("/login");
		}
	}, [userState, location.pathname, navigate]);

	if (!isAuthReady) {
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
						readCardsFromDB={readCardsFromDB}
						updateCardsInDB={updateCardsInDB}
						deleteCardInDB={deleteCardInDB}
						clearDoneCardsInDB={clearDoneCardsInDB}
						deleteAllCardsInDB={deleteAllCardsInDB}
					/>
				}
			/>
			<Route path="/login" element={<Login />} />
			<Route
				path="/guest"
				element={
					userState === "guest" && (
						<Dashboard
							addCardToDB={addCardToDB}
							readCardsFromDB={readCardsFromDB}
							updateCardsInDB={updateCardsInDB}
							deleteCardInDB={deleteCardInDB}
							clearDoneCardsInDB={clearDoneCardsInDB}
							deleteAllCardsInDB={deleteAllCardsInDB}
						/>
					)
				}
			/>
			<Route path="/register" element={<Register />} />
		</Routes>
	);
}

export default App;
