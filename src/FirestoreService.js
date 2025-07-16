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
