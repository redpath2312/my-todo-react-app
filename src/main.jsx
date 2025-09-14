import { useEffect, useState } from "react";
import App from "./App.jsx";
import { useAuth } from "./AuthContext";
import { db } from "./firebaseconfig.js";
import { useAlert } from "./ErrorContext.jsx";
import {
	addCard,
	clearDoneCards,
	updateCard,
	deleteCard,
	deleteAllCards,
} from "./FirestoreService.js";

import { doc, onSnapshot } from "firebase/firestore";
import { ThemeModeProvider } from "./theme/ThemeModeContext.jsx";

import { setLogLevel } from "firebase/app";
setLogLevel("debug"); // verbose Firebase logs in console

// import { textFieldClasses } from "@mui/material";

function Main() {
	// console.log("Main.jsx rendered");
	const [cards, setCards] = useState([]);
	const [isAdding, setIsAdding] = useState(false);
	const { addAlert, addThrottledAlert } = useAlert();
	const { user } = useAuth();

	//temporary for auth redirect debugging
	// before any auth calls (e.g., in main.jsx)
	try {
		sessionStorage.setItem("__test", "1");
		sessionStorage.removeItem("__test");
		console.log("sessionStorage OK");
	} catch {
		console.warn(
			"sessionStorage blocked. Use popup or change browser settings."
		);
	}

	function toErrorMessage(err) {
		// Firebase errors usually have .code and .message
		if (err?.code || err?.message) {
			return `[${err.code || "unknown"}] ${err.message || ""}`.trim();
		}
		return typeof err === "string" ? err : JSON.stringify(err);
	}

	const handleDBAddCard = async (
		cardText,
		highPriorityDraft,
		dashTaskDraft
	) => {
		//have state of isAdding and whilst is Adding pass down as prop so card knows to disable
		//once card in db update isAdding to false
		setIsAdding(true);
		try {
			await addCard(user, cardText, highPriorityDraft, dashTaskDraft);
			addAlert("Card successfully added", "info", 3000);
		} catch (error) {
			console.error("Transaction failed:", error);
			addThrottledAlert(
				`Error adding card to db: ${toErrorMessage(error)}`,
				"error",
				6000
			);
			console.error("updatedCard failed", error);
		} finally {
			setIsAdding(false);
		}
	};

	const handleDBUpdate = async (cardID, updatedFields) => {
		try {
			await updateCard(user, cardID, updatedFields);
			addAlert(`Card ${cardID} updated`, "info", 3000);
		} catch (error) {
			addAlert(
				`Error updating firestore: ${toErrorMessage(error)}`,
				"error",
				6000
			);
			console.log("Updating card failed", error);
		}
	};

	const handleDBClearDone = async (filteredCards) => {
		try {
			console.log("filtered Cards to be passed", filteredCards);
			console.log("About to clear done cards");
			await clearDoneCards(user, filteredCards);
			addAlert("Cleared all done cards from db", "info", 3000);
		} catch (error) {
			addAlert(`Error updating firestore: ${error}`, "error", 6000);
		}
	};

	const handleDBCardDelete = async (cardID) => {
		try {
			await deleteCard(user, cardID);
			addAlert(`Deleted Card ${cardID} from database`, "info", 3000);
		} catch (error) {
			addAlert(
				`Error deleting card from database: ${toErrorMessage(error)}`,
				"error",
				6000
			);
		}
	};

	const handleDBDeleteAll = async () => {
		try {
			await deleteAllCards(user);
			addAlert("Deleted cards from database successfully", "info", 3000);
		} catch (error) {
			addAlert(
				`Error deleting cards from database: ${toErrorMessage(error)}`,
				"error",
				6000
			);
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

	console.info(
		`[DashTasker] MODE=${import.meta.env.MODE} | PROD=${
			import.meta.env.PROD
		} | ENV=${import.meta.env.VITE_ENV_NAME} | PROJECT=${
			import.meta.env.VITE_FIREBASE_PROJECT_ID
		} | EMU_AUTH=${import.meta.env.VITE_USE_AUTH_EMULATOR} | EMU_DB=${
			import.meta.env.VITE_USE_DB_EMULATOR
		}`
	);

	return (
		// <StrictMode>
		<ThemeModeProvider>
			<App
				addCardToDB={handleDBAddCard}
				updateCardsInDB={handleDBUpdate}
				deleteCardInDB={handleDBCardDelete}
				dbCards={cards}
				clearDoneCardsInDB={handleDBClearDone}
				deleteAllCardsInDB={handleDBDeleteAll}
				isAdding={isAdding}
			/>
		</ThemeModeProvider>
	);
}
export default Main;
