import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";

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
	const { user, userState } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (userState === "loggedIn" || userState === "refreshing") {
			navigate("/dashboard");
		} else if (userState === "guest") {
			navigate("/guest");
		} else if (userState === "loggedOut") {
			navigate("/login");
		}
	}, [userState]);
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
		</Routes>
	);
}

export default App;
