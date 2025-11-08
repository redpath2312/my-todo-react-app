import { useEffect, useState, useRef } from "react";
import App from "./App.jsx";
import { useAuth } from "./AuthContext";
// import { db } from "./firebaseconfig.js";
import { getDbClient, fs } from "./firebaseDbClient.js";
import { useAlert } from "./ErrorContext.jsx";
import { devDebug, error as logError } from "./utils/logger";
import { useUI } from "./UIContext.jsx";

import { ThemeModeProvider } from "./theme/ThemeModeContext.jsx";

// import { textFieldClasses } from "@mui/material";

function Main() {
	const [cards, setCards] = useState([]);
	const [cardsReady, setCardsReady] = useState(false); // ← NEW
	const [isAdding, setIsAdding] = useState(false);
	const { addAlert, addThrottledAlert } = useAlert();
	const addAlertRef = useRef(addAlert);
	const { userState, user } = useAuth();
	const svcRef = useRef(null); // FirestoreService once logged in

	const { transitionState } = useUI() ?? {}; // hook at top level
	const uid = user?.uid ?? null;
	// Refs to avoid stale values inside snapshot callbacks
	const userStateRef = useRef(userState);
	const uidRef = useRef(uid);
	const transitionRef = useRef(transitionState);
	const getIdTokenRef = useRef(user?.getIdToken?.bind(user) || null);
	const unsubRef = useRef(null); // snapshot unsubscribe
	const subVersionRef = useRef(0);
	const firstSnapSeenForVersionRef = useRef(0); // ← NEW

	// Keep refs in sync with latest props/state every render
	userStateRef.current = userState;
	uidRef.current = user?.uid ?? null;
	transitionRef.current = transitionState;
	getIdTokenRef.current = user?.getIdToken?.bind(user) || null;

	// keep alert ref fresh
	useEffect(() => {
		addAlertRef.current = addAlert;
	}, [addAlert]);

	// Reset "ready" when auth identity changes
	useEffect(() => {
		setCardsReady(false);
	}, [userState, uid]);

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

	useEffect(() => {
		// bump version so prior callbacks become no-ops
		const myVersion = ++subVersionRef.current;
		firstSnapSeenForVersionRef.current = 0; // ← NEW: mark no snap yet

		// cleanup prior listener
		if (unsubRef.current) {
			unsubRef.current();
			unsubRef.current = null;
		}

		if (userState !== "loggedIn" || !uid) {
			setCards([]);
			setCardsReady(false);
			return;
		}

		let active = true;

		(async () => {
			try {
				const db = await getDbClient();
				const { doc, onSnapshot } = await fs();

				// ensure rules see request.auth
				try {
					const getIdToken = getIdTokenRef.current;
					if (!getIdToken) return; // transiently missing; retry on next tick
					await getIdToken();
				} catch {
					return; // token not ready; retry on next tick
				}

				const userRef = doc(db, "users", uid);

				const unsubscribe = onSnapshot(
					userRef,
					(snap) => {
						// bail if unmounted/re-subscribed
						if (!active || myVersion !== subVersionRef.current) return;
						if (snap.metadata.hasPendingWrites) return;

						setCards(snap.exists() ? snap.data().cards || [] : []);
						// ← NEW: flip ready exactly once per subscription
						if (firstSnapSeenForVersionRef.current !== myVersion) {
							firstSnapSeenForVersionRef.current = myVersion;
							setCardsReady(true);
						}
					},
					(err) => {
						const code = err?.code || "";
						const transient =
							code === "permission-denied" || code === "unauthenticated";
						const inTransition =
							transitionRef.current === "switching-to-guest" ||
							transitionRef.current === "signing-out";
						const notLoggedInNow = userStateRef.current !== "loggedIn";

						if (transient && (inTransition || notLoggedInNow)) return;
						// optional: ignore if uid changed mid-flight
						if (uidRef.current !== uid) return;

						addAlertRef.current?.(
							`Snapshot listener error: ${
								toErrorMessage?.(err) ?? String(err)
							}`,
							"error",
							6000
						);
						logError("Snapshot error", err);
					}
				);

				unsubRef.current = unsubscribe;
			} catch (e) {
				logError("Listener setup error", e);
			}
		})();

		return () => {
			active = false;
			if (unsubRef.current) {
				unsubRef.current();
				unsubRef.current = null;
			}
		};
		//  no missing-deps warning now
	}, [userState, uid]);

	devDebug(
		`[DashTasker] MODE=${import.meta.env.MODE} | PROD=${
			import.meta.env.PROD
		} | ENV=${import.meta.env.VITE_ENV_NAME} | PROJECT=${
			import.meta.env.VITE_FIREBASE_PROJECT_ID
		} | EMU_AUTH=${import.meta.env.VITE_USE_AUTH_EMULATOR} | EMU_DB=${
			import.meta.env.VITE_USE_DB_EMULATOR
		}`
	);
	devDebug("Cards ready: ", cardsReady);

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
				cardsReady={cardsReady}
			/>
		</ThemeModeProvider>
	);
}
export default Main;
