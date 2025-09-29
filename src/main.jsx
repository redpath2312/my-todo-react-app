import { useEffect, useState, useRef } from "react";
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

import { setLogLevel } from "firebase/firestore";
// Optional manual override: VITE_FIRESTORE_LOG (debug | error | silent)
const manual = import.meta.env.VITE_FIRESTORE_LOG;

if (manual) {
	setLogLevel(manual); // trust your override
} else if (import.meta.env.DEV) {
	setLogLevel("debug"); // local dev
} else if (import.meta.env.MODE === "devpreview") {
	setLogLevel("error"); // show only errors on preview
} else {
	setLogLevel("silent"); // prod: no Firestore noise
}

// import { textFieldClasses } from "@mui/material";

function Main() {
	// console.log("Main.jsx rendered");
	const [cards, setCards] = useState([]);
	const [isAdding, setIsAdding] = useState(false);
	const { addAlert, addThrottledAlert } = useAlert();
	const addAlertRef = useRef(addAlert);
	const { user } = useAuth();

	//temporary for auth redirect debugging
	// before any auth calls (e.g., in main.jsx)
	// try {
	// 	sessionStorage.setItem("__test", "1");
	// 	sessionStorage.removeItem("__test");
	// 	console.log("sessionStorage OK");
	// } catch {
	// 	console.warn(
	// 		"sessionStorage blocked. Use popup or change browser settings."
	// 	);
	// }

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
		if (isAdding) return;
		setIsAdding(true);
		try {
			await addCard(user, cardText, highPriorityDraft, dashTaskDraft);
			addAlert("Card successfully added", "info", 3000);
		} catch (err) {
			console.error("Transaction failed:", err);
			addThrottledAlert(
				`Error adding card to db: ${toErrorMessage(err)}`,
				"error",
				6000
			);
			console.error("updatedCard failed", err);
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
			throw error;
		}
	};

	const handleDBClearDone = async (filteredCards) => {
		try {
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
			{ includeMetadataChanges: true },
			(userSnap) => {
				// ⬇️ ignore local echoes from our own pending writes
				if (userSnap.metadata.hasPendingWrites) return;
				if (userSnap.exists()) {
					const userData = userSnap.data();
					setCards(userData.cards || []);
				} else {
					setCards([]);
				}
			},
			(error) => {
				// ensure it's a single string; your addAlert likely expects (msg, severity?, ms?)
				addAlertRef.current?.(
					`Snapshot listener error: ${
						toErrorMessage?.(error) ?? String(error)
					}`,
					"error",
					6000
				);
				// allowed by your lint:errors rule
				console.error("Snapshot error", error);
			}
		);
		// Cleanup the listener on component unmount
		return () => unsubscribe();
	}, [user]);

	// console.info(
	// 	`[DashTasker] MODE=${import.meta.env.MODE} | PROD=${
	// 		import.meta.env.PROD
	// 	} | ENV=${import.meta.env.VITE_ENV_NAME} | PROJECT=${
	// 		import.meta.env.VITE_FIREBASE_PROJECT_ID
	// 	} | EMU_AUTH=${import.meta.env.VITE_USE_AUTH_EMULATOR} | EMU_DB=${
	// 		import.meta.env.VITE_USE_DB_EMULATOR
	// 	}`
	// );

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
