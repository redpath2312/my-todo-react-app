import { StrictMode, useEffect, useState } from "react";
import App from "./App.jsx";
import { useAuth } from "./AuthContext";
import { db, auth } from "./firebaseconfig.js";
import { useAlert } from "./ErrorContext.jsx";
import {
	addCard,
	clearDoneCards,
	updateCard,
	deleteCard,
	deleteAllCards,
} from "./FirestoreService.js";

import { doc, onSnapshot } from "firebase/firestore";
// import { textFieldClasses } from "@mui/material";

function Main(props) {
	// console.log("Main.jsx rendered");
	const [cards, setCards] = useState([]);
	const [isAdding, setIsAdding] = useState(false);
	const { addAlert, addThrottledAlert } = useAlert();
	const { user, userState } = useAuth();

	const handleDBAddCard = async (cardText) => {
		//have state of isAdding and whilst is Adding pass down as prop so card knows to disable
		//once card in db update isAdding to false
		setIsAdding(true);
		try {
			await addCard(user, cardText);
			addAlert("Card successfully added", "info", 3000);
		} catch (error) {
			console.error("Transaction failed:", error);
			addThrottledAlert("Error adding card to db", "error", 3000);
		} finally {
			setIsAdding(false);
		}
	};

	const handleDBUpdate = async (cardID, updatedFields) => {
		try {
			await updateCard(user, cardID, updatedFields);
			addAlert(`Card ${cardID} updated`, "info", 3000);
		} catch (error) {
			addAlert("Error updating firestore: ", error);
		}
	};

	const handleDBClearDone = async (filteredCards) => {
		try {
			console.log("filtered Cards to be passed", filteredCards);
			console.log("About to clear done cards");
			await clearDoneCards(user, filteredCards);
			addAlert("Cleared all done cards from db", "info", 3000);
		} catch (error) {
			addAlert("Error updating firestore", error);
		}
	};

	const handleDBCardDelete = async (cardID) => {
		try {
			await deleteCard(user, cardID);
			addAlert(`Deleted Card ${cardID} from database`, "info", 3000);
		} catch (error) {
			addAlert("Error deleting card from database: ", error);
		}
	};

	const handleDBDeleteAll = async () => {
		try {
			await deleteAllCards(user);
			addAlert("Deleted cards from database successfully", "info", 3000);
		} catch (error) {
			addAlert("Error deleting cards from database: ", error);
		}
	};

	useEffect(() => {
		if (!user) return;
		const userRef = doc(db, "users", user.uid);
		const unsubscribe = onSnapshot(
			userRef,
			(userSnap) => {
				if (userSnap.exists()) {
					const userData = userSnap.data();
					console.log("Snapshot fired, cards:", userData.cards);
					setCards(userData.cards || []);
				} else {
					setCards([]);
				}
			},
			(error) => {
				addAlert("Snapshot listener error:", error);
			}
		);

		// Cleanup the listener on component unmount
		return () => unsubscribe();
	}, [user]);

	return (
		// <StrictMode>
		<App
			addCardToDB={handleDBAddCard}
			updateCardsInDB={handleDBUpdate}
			deleteCardInDB={handleDBCardDelete}
			dbCards={cards}
			clearDoneCardsInDB={handleDBClearDone}
			deleteAllCardsInDB={handleDBDeleteAll}
			isAdding={isAdding}
		/>
	);
}
export default Main;
