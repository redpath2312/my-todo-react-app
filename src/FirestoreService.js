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
import { log, error as logError } from "./utils/logger";

// helper (optional): normalized log payload
const logFsError = (where, e) =>
	logError(`${where} failed`, { code: e?.code, message: e?.message });

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
		try {
			await setDoc(userRef, {
				displayName: user.displayName || "Anonymous",
				email: user.email,
				maxID: 0,
				createdAt: serverTimestamp(),
				cards: [],
			});
		} catch (err) {
			logError("fs:CreateUserDoc", err);
			throw err;
		}
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
	try {
		await runTransaction(db, async (tx) => {
			const userSnap = await tx.get(userRef); // 1) Read inside tx
			if (!userSnap.exists()) throw new Error("User not found");

			const userData = userSnap.data();
			const nextID = (userData.maxID ?? 0) + 1; //2) Compute the next incremental id

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
	} catch (err) {
		logError("fs:AddCard", err);
		throw err;
	}
}

export async function updateCard(user, cardID, updatedFields) {
	const uid = requireUid(user);
	const userRef = doc(db, "users", uid);
	try {
		await runTransaction(db, async (tx) => {
			const userSnap = await tx.get(userRef);
			if (!userSnap.exists()) {
				throw new Error("User not found");
			}
			const currentCards = userSnap.data().cards ?? [];
			let changed = false;
			const updatedCards = currentCards.map((card) => {
				if (card.id !== cardID) return card;

				const updatedCard = {
					...card,
					...updatedFields,
					...(updatedFields.text != null
						? { text: String(updatedFields.text).trim() }
						: {}),
				};

				const same =
					updatedCard.text === card.text &&
					updatedCard.highPriority === card.highPriority &&
					updatedCard.done === card.done &&
					updatedCard.dashTask === card.dashTask;

				if (same) return card; //no change to the card
				changed = true;
				return updatedCard;
			});

			if (!changed) return;

			tx.update(userRef, { cards: updatedCards });
		});
	} catch (err) {
		logFsError("fs:updateCard", err);
		throw err;
	}
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
	try {
		if (!userSnap.exists()) {
			throw new Error("No user on db"); //will exit so updateDoc won't run
		}
		const cards = userSnap.data().cards ?? [];
		if (cards.length === 0) return; // no-op, skip write
		await updateDoc(userRef, { cards: [] });
	} catch (err) {
		logError("fs:deleteAllCards", err);
	}
}

export async function deleteCard(user, cardID) {
	const uid = requireUid(user);
	const userRef = doc(db, "users", uid);
	try {
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
	} catch (err) {
		logError("fs:deleteCard", err);
	}
}
