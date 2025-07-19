import { db } from "./firebaseconfig";
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
	serverTimestamp,
	runTransaction,
	increment,
} from "firebase/firestore";

export async function createUserDoc(user) {
	const userRef = doc(db, "users", user.uid);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		await setDoc(userRef, {
			displayName: user.displayName || "Anonymous",
			email: user.email,
			maxID: 0,
			createdAt: serverTimestamp(),
			cards: [],
		});
	}
	console.log(user.uid);
}

//Adds the new card to firestore, and returns it back to main for local updating.
export async function addCard(user, cardText) {
	const userRef = doc(db, "users", user.uid);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		throw new Error("No user on db");
	} else {
		const currentMaxID = userSnap.data().maxID;
		const newID = currentMaxID + 1;
		const currentCards = userSnap.data().cards || [];
		const newCard = {
			id: newID,
			text: cardText,
			renderKey: crypto.randomUUID(),
			highPriority: false,
			done: false,
			createdAt: new Date(),
		};
		const updatedCards = [...currentCards, newCard];
		await updateDoc(userRef, {
			cards: updatedCards,
			maxID: increment(1),
		});
		return newCard;
	}
}

export async function updateCard(user, cardID, updatedFields) {
	const userRef = doc(db, "users", user.uid);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		throw new Error("No user on db");
	} else {
		const userData = userSnap.data();
		const currentCards = userData.cards || [];
		console.log(currentCards);
		console.log(updatedFields);
		const updatedCards = currentCards.map((card) =>
			card.id === cardID
				? {
						...card,
						...updatedFields,
				  }
				: card
		);
		await updateDoc(userRef, { cards: updatedCards });
		console.log(`Card ID ${cardID} successfully updated in Firestore`);
		return updatedCards;
	}
}
export async function clearDoneCards(user, filteredCards) {
	const userRef = doc(db, "users", user.uid);
	const userSnap = await getDoc(userRef);
	if (userSnap.exists()) {
		await updateDoc(userRef, { cards: filteredCards });
		console.log("'Done' Cards successfully cleared in firestore");
	} else throw new Error("No user on db");
}
export async function deleteCard(user, cardID) {
	const userRef = doc(db, "users", user.uid);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		throw new Error("No user on db");
	} else {
		const currentCards = userSnap.data().cards;
		const filteredCards = currentCards.filter((card) => card.id != cardID);
		await updateDoc(userRef, { cards: filteredCards });
		console.log("Deleted card from firestore");
	}
}

export async function deleteAllCards(user) {
	const userRef = doc(db, "users", user.uid);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		throw new Error("No user on db");
	} else {
		await updateDoc(userRef, { cards: [] });
	}
}
