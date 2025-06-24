import { StrictMode, useEffect, useState } from "react";
import App from "./App.jsx";
// import { firestore } from "./firebaseconfig.js";
// import { initializeApp } from "firebase/app";
import { db, auth } from "./firebaseconfig.js";
import { useAlert } from "./ErrorContext.jsx";
import { runTransaction } from "firebase/firestore";

import {
	where,
	query,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	addDoc,
	collection,
	onSnapshot,
	deleteDoc,
} from "firebase/firestore";
// import { textFieldClasses } from "@mui/material";

function Main(props) {
	const [cards, setCards] = useState([]);
	const [isAdding, setIsAdding] = useState(false);
	const { addAlert, addThrottledAlert } = useAlert();

	const testDoc = doc(db, "testCollection/testList");
	const metaDocRef = doc(db, "metaData/maxID");

	const handleDBAddCard = async (cardText) => {
		//have state of isAdding and whilst is Adding pass down as prop so card knows to disable
		//once card in db update isAdding to false
		setIsAdding(true);
		try {
			//simulate delay
			// await new Promise((resolve) => setTimeout(resolve, 5000));

			let newCard = null;

			// Check if the document exists
			await runTransaction(db, async (transaction) => {
				//Get maxID and increment
				const metaSnap = await getDoc(metaDocRef);
				const currentMaxID = metaSnap.exists() ? metaSnap.data().maxID || 0 : 0;
				const newID = currentMaxID + 1;

				newCard = {
					id: newID,
					text: cardText,
					renderKey: crypto.randomUUID(),
					highPriority: false,
					checked: false,
				};

				//Get existing card list or start a new one

				const cardSnap = await transaction.get(testDoc);
				const existingCards = cardSnap.exists() ? cardSnap.data().cards : [];
				const updatedCards = [...existingCards, newCard];

				//Update both docs within the transaction
				transaction.set(metaDocRef, { maxID: newID }, { merge: true });
				transaction.set(testDoc, { cards: updatedCards }, { merge: true });
			});

			setCards((prev) => [...prev, newCard]);
			// console.log("Card successfully added:", newCard);
			addAlert("Card successfully added", "info", 3000);
		} catch (error) {
			addThrottledAlert("Error adding card to db", "error", 3000);
			console.error("Transaction failed:", error);
		} finally {
			setIsAdding(false);
		}
	};

	const handleDBUpdate = async (cardID, updatedFields) => {
		try {
			const docSnap = await getDoc(testDoc);
			if (docSnap.exists()) {
				const docData = docSnap.data();
				const updatedCards = docData.cards.map((card) =>
					card.id === cardID ? { ...card, ...updatedFields } : card
				);
				await updateDoc(testDoc, { cards: updatedCards });
				console.log(`Card ID ${cardID} successfully updated in Firestore`);
				setCards(updatedCards);
			} else {
				// console.warn("Document does not exist. Cannot update Card.");
				addAlert("Document does not exist. Cannot update Card.", "warn", 4000);
			}
		} catch (error) {
			// console.error("Error updating firestore: ", error);
			addAlert("Error updating firestore: ", error);
		}
	};

	const handleDBClearDone = async (filteredCards) => {
		try {
			const docSnap = await getDoc(testDoc);
			if (docSnap.exists()) {
				await setDoc(testDoc, { cards: filteredCards }, { merge: true });
				console.log("Done cards cleared in DB");
			} else {
				addAlert("document doesn't exist", "warn", 4000);
			}
		} catch (error) {
			addAlert("Error updating firestore", error);
		}
	};

	async function fetchCards() {
		try {
			const docSnap = await getDoc(testDoc);
			if (docSnap.exists()) {
				const docData = docSnap.data();
				// console.log("Fetched cards", docData.cards);
				setCards(docData.cards || []);
			} else {
				addAlert("No document found, there maybe no cards", "info", 3000);
			}
		} catch (error) {
			addAlert("Error fetching cards", error);
		}
	}

	const handleDBCardDelete = async (cardID) => {
		try {
			const docSnap = await getDoc(testDoc);
			if (docSnap.exists()) {
				const docData = docSnap.data();
				const updatedCards = docData.cards.filter((card) => card.id != cardID);
				await updateDoc(testDoc, { cards: updatedCards });
				setCards(updatedCards);
				console.log(`Card ID ${cardID} deleted`);
			} else {
				addAlert("No document found to delete card", "warn", 4000);
			}
		} catch (error) {
			addAlert("Error deleting card from database: ", error);
		}
	};

	const handleDBDeleteAll = async () => {
		try {
			const docSnap = await getDoc(testDoc);
			const metaDocSnap = await getDoc(metaDocRef);
			if (docSnap.exists() && metaDocSnap.exists()) {
				await deleteDoc(testDoc);
				await deleteDoc(metaDocRef);
				console.log(`Deleted all cards`);
				setCards([]);
			} else {
				addAlert("No document found to delete cards", "warn", 4000);
			}
		} catch (error) {
			addAlert("Error deleting cards from database: ", error);
		}
	};

	useEffect(() => {
		const unsubscribe = onSnapshot(
			testDoc,
			(docSnap) => {
				if (docSnap.exists()) {
					const docData = docSnap.data();
					setCards(docData.cards || []);
				} else {
					// Removed alert as fires even in guest mode
					// addAlert(
					// 	"No document found in snapshot, there maybe no Cards",
					// 	"info",
					// 	3000
					// 	//this fires even on just refreshing guest mode page
					// );
					setCards([]);
				}
			},
			(error) => {
				addAlert("Snapshot listener error:", error);
			}
		);

		// Cleanup the listener on component unmount
		return () => unsubscribe();
	}, []);

	return (
		<StrictMode>
			<App
				addCardToDB={handleDBAddCard}
				readCardsFromDB={fetchCards}
				updateCardsInDB={handleDBUpdate}
				deleteCardInDB={handleDBCardDelete}
				dbCards={cards}
				clearDoneCardsInDB={handleDBClearDone}
				deleteAllCardsInDB={handleDBDeleteAll}
				isAdding={isAdding}
			/>
		</StrictMode>
	);
}
export default Main;
