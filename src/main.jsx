import { useEffect, useState, useRef } from "react";
import App from "./App.jsx";
import { useAuth } from "./AuthContext";
// import { db } from "./firebaseconfig.js";
import { getDbClient, fs } from "./firebaseDbClient.js";
import { useAlert } from "./ErrorContext.jsx";
import { error as logError } from "./utils/logger";

import { ThemeModeProvider } from "./theme/ThemeModeContext.jsx";

// import { textFieldClasses } from "@mui/material";

function Main() {
	const [cards, setCards] = useState([]);
	const [isAdding, setIsAdding] = useState(false);
	const { addAlert, addThrottledAlert } = useAlert();
	const addAlertRef = useRef(addAlert);
	const { userState, user } = useAuth();
	const svcRef = useRef(null); // FirestoreService once logged in
	const unsubRef = useRef(null); // snapshot unsubscribe
	// keep alert ref fresh
	useEffect(() => {
		addAlertRef.current = addAlert;
	}, [addAlert]);

	useEffect(() => {
		(async () => {
			if (userState === "loggedIn") {
				svcRef.current = await import("./FirestoreService.js");
			} else {
				svcRef.current = null;
			}
		})();
	}, [userState]);

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
		if (userState !== "loggedIn" || !user?.uid) return;
		if (isAdding) return;
		setIsAdding(true);
		try {
			await svcRef.current?.addCard(
				user,
				cardText,
				highPriorityDraft,
				dashTaskDraft
			);
			addAlert("Card successfully added", "info", 3000);
		} catch (err) {
			addThrottledAlert(
				`Error adding card to db: ${toErrorMessage(err)}`,
				"error",
				6000
			);
			logError("Adding card failed", err);
		} finally {
			setIsAdding(false);
		}
	};

	const handleDBUpdate = async (cardID, updatedFields) => {
		if (userState !== "loggedIn" || !user?.uid) return;
		try {
			await svcRef.current?.updateCard(user, cardID, updatedFields);
			addAlert(`Card ${cardID} updated`, "info", 3000);
		} catch (err) {
			addAlert(
				`Error updating firestore: ${toErrorMessage(err)}`,
				"error",
				6000
			);
			throw err;
		}
	};

	const handleDBClearDone = async (filteredCards) => {
		if (userState !== "loggedIn" || !user?.uid) return;
		try {
			await svcRef.current?.clearDoneCards(user, filteredCards);
			addAlert("Cleared all done cards from db", "info", 3000);
		} catch (err) {
			addAlert(`Error updating firestore: ${err}`, "error", 6000);
		}
	};

	const handleDBCardDelete = async (cardID) => {
		if (userState !== "loggedIn" || !user?.uid) return;
		try {
			await svcRef.current?.deleteCard(user, cardID);
			addAlert(`Deleted Card ${cardID} from database`, "info", 3000);
		} catch (err) {
			addAlert(
				`Error deleting card from database: ${toErrorMessage(err)}`,
				"error",
				6000
			);
		}
	};

	const handleDBDeleteAll = async () => {
		if (userState !== "loggedIn" || !user?.uid) return;
		try {
			await svcRef.current?.deleteAllCards(user);
			addAlert("Deleted cards from database successfully", "info", 3000);
		} catch (err) {
			addAlert(
				`Error deleting cards from database: ${toErrorMessage(err)}`,
				"error",
				6000
			);
		}
	};
	// Live user doc listener (only when logged in)
	useEffect(() => {
		// cleanup prior listener
		if (unsubRef.current) {
			unsubRef.current();
			unsubRef.current = null;
		}
		if (userState !== "loggedIn" || !user?.uid) {
			// not authed - Main won't manage cards, dashboard handles guest.
			setCards([]);
			return;
		}

		let active = true;
		(async () => {
			const db = await getDbClient();
			const { doc, onSnapshot } = await fs();

			const userRef = doc(db, "users", user.uid);
			const unsubscribe = onSnapshot(
				userRef,
				{ includeMetadataChanges: true },
				(userSnap) => {
					if (!active) return;
					// ⬇️ ignore local echoes from our own pending writes
					if (userSnap.metadata.hasPendingWrites) return;
					if (userSnap.exists()) {
						const userData = userSnap.data();
						setCards(userData.cards || []);
					} else {
						setCards([]);
					}
				},
				(err) => {
					// ensure it's a single string; your addAlert likely expects (msg, severity?, ms?)
					addAlertRef.current?.(
						`Snapshot listener error: ${
							toErrorMessage?.(err) ?? String(err)
						}`,
						"error",
						6000
					);
					// allowed by your lint:errors rule
					logError("Snapshot error", err);
				}
			);
			unsubRef.current = unsubscribe;
		})();
		return () => {
			active = false;
			if (unsubRef.current) {
				unsubRef.current();
				unsubRef.current = null;
			}
		};
	}, [userState, user?.uid]);

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
