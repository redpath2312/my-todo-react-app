import { StrictMode, useEffect, useState } from "react";
import App from "./App.jsx";
// import { firestore } from "./firebaseconfig.js";
// import { initializeApp } from "firebase/app";
import { db, auth } from "./firebaseconfig.js";
import { useAlert } from "./ErrorContext.jsx";

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
	const { addAlert } = useAlert();
	const testDoc = doc(db, "testCollection/testList");
	const metaDocRef = doc(db, "metaData/maxID");

	const fetchMaxID = async () => {
		const docSnap = await getDoc(metaDocRef);
		return docSnap.exists() ? docSnap.data().maxID || 0 : 0;
	};

	const handleDBAddCard = async (cardText) => {
		try {
			// Check if the document exists
			const docSnap = await getDoc(testDoc);
			let updatedCards = [];
			const newID = (await fetchMaxID()) + 1;

			const newCard = {
				id: newID,
				text: cardText,
				key: newID,
				highPriority: false,
				checked: false,
			};

			if (docSnap.exists()) {
				// Document exists, retrieve the current cards array
				const docData = docSnap.data();
				updatedCards = [...docData.cards, newCard];
				await updateDoc(testDoc, { cards: updatedCards });
				await setDoc(metaDocRef, { maxID: newID }, { merge: true });
			} else {
				try {
					// Document doesn't exist, create it with the new card
					updatedCards = [newCard];
					await setDoc(testDoc, { cards: updatedCards });
					await setDoc(metaDocRef, { maxID: newID }, { merge: true });
				} catch (error) {
					addAlert("Error creating Initial Card: ", error);
				}
			}

			// Update local state
			setCards(updatedCards);
			console.log("Card successfully added:", newCard);
			addAlert("Card successfully added", "info", 3000);
		} catch (error) {
			addAlert("Error adding another card:", error);
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
					addAlert(
						"No document found in snapshot, there maybe no Cards",
						"info",
						3000
					);
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
			/>
		</StrictMode>
	);
}
export default Main;
