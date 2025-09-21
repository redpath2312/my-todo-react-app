import { db } from "./firebaseconfig";
import {
	doc,
	getDoc,
	setDoc,
	updateDoc,
	serverTimestamp,
	runTransaction,
	arrayUnion,
} from "firebase/firestore";

function requireUid(user) {
	const uid = user?.uid;
	if (!uid) throw new Error("Guest sessions cannt use firestore.");
	return uid;
}
export async function createUserDoc(user) {
	const uid = requireUid(user);
	const userRef = doc(db, "users", uid);
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
}

export async function addCard(
	user,
	cardText,
	highPriorityDraft,
	dashTaskDraft
) {
	const uid = requireUid(user);
	const userRef = doc(db, "users", uid);
	let newCard;
	await runTransaction(db, async (tx) => {
		const userSnap = await tx.get(userRef); // 1) Read inside tx
		if (!userSnap.exists()) throw new Error("User not found");

		const userData = userSnap.data();
		const nextID = (userData.maxID ?? 0) + 1; //2) Compuer the next incremental id

		newCard = {
			id: nextID,
			text: cardText,
			renderKey: crypto.randomUUID(),
			highPriority: !!highPriorityDraft,
			dashTask: !!dashTaskDraft,
			done: false,
			createdAt: new Date(),
		};
		tx.update(userRef, {
			maxID: nextID, // atomic + consistent with newCard.id
			cards: arrayUnion(newCard), //efficient append
		});
	});

	return newCard; // caller can optimistically insert it into local state
}

export async function updateCard(user, cardID, updatedFields) {
	const uid = requireUid(user);
	const userRef = doc(db, "users", uid);

	await runTransaction(db, async (tx) => {
		const userSnap = await tx.get(userRef);
		if (!userSnap.exists()) {
			throw new Error("User not found");
		}
		const currentCards = userSnap.data().cards ?? [];
		const updatedCards = currentCards.map((card) =>
			card.id === cardID ? { ...card, ...updatedFields } : card
		);

		tx.update(userRef, { cards: updatedCards });
		return updatedCards;
	});
}
export async function clearDoneCards(user, filteredCards) {
	const uid = requireUid(user);
	const userRef = doc(db, "users", uid);
	const userSnap = await getDoc(userRef);
	if (userSnap.exists()) {
		await updateDoc(userRef, { cards: filteredCards });
	} else throw new Error("User not found");
}

export async function deleteAllCards(user) {
	const uid = requireUid(user);
	const userRef = doc(db, "users", uid);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		throw new Error("No user on db");
	} else {
		await updateDoc(userRef, { cards: [] });
	}
}

export async function deleteCard(user, cardID) {
	const uid = requireUid(user);
	const userRef = doc(db, "users", uid);
	await runTransaction(db, async (tx) => {
		const userSnap = await tx.get(userRef);
		if (!userSnap.exists()) {
			throw new Error("User not found");
		}
		const currentCards = userSnap.data().cards ?? [];
		const updatedCards = currentCards.filter((card) => card.id !== cardID);
		tx.update(userRef, { cards: updatedCards });
		return updatedCards;
	});
}
