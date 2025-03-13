import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Main from "./main";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import DraftCard from "./Components/DraftCard";
import Card from "./Components/Card";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

function App({
	isAuth,
	dbCards,
	addCardToDB,
	readCardsFromDB,
	updateCardsInDB,
	deleteCardInDB,
	clearDoneCardsInDB,
	deleteAllCardsInDB,
}) {
	const [isGuest, setIsGuest] = useState(true);

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						isAuth || isGuest ? (
							<Dashboard
								isAuth={isAuth}
								isGuest={isGuest}
								dbCards={dbCards}
								addCardToDB={addCardToDB}
								readCardsFromDB={readCardsFromDB}
								updateCardsInDB={updateCardsInDB}
								deleteCardInDB={deleteCardInDB}
								clearDoneCardsInDB={clearDoneCardsInDB}
								deleteAllCardsInDB={deleteAllCardsInDB}
							/>
						) : (
							<Navigate to="/login" />
						)
					}
				/>
				<Route path="/login" element={<Login />} />
				<Route
					path="/guest"
					element={
						!isAuth && (
							<Dashboard
								isAuth={isAuth}
								isGuest={isGuest}
								dbCards={dbCards}
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
		</Router>
	);
}

export default App;
