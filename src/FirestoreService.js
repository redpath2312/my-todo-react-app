import { getDbClient, fs } from "./firebaseDbClient";
//  now do i just create a const db for this so the db referred to in funcitons below continue to work?
import { error as logError, info } from "./utils/logger";

// helper (optional): normalized log payload
const logFsError = (where, e) =>
	logError(`${where} failed`, { code: e?.code, message: e?.message });

function requireUid(user) {
	const uid = user?.uid;
	if (!uid) throw new Error("Guest sessions cannot use firestore.");
	return uid;
}
export async function createUserDoc(user) {
	info("CreateUserDoc Check Started");

	// Bail if we're in a transition or guest
	if (!user?.uid) return;
	try {
		if (localStorage.getItem("guest") === "true") return;
	} catch {
		logError("Couldn't get guest item from local storage");
	}

	// Ensure we're still the current signed-in user
	const authUser = user.auth?.currentUser ?? null;
	if (!authUser || authUser.uid !== user.uid) return;

	// Ensure Firestore will see request.auth
	try {
		await user.getIdToken(false);
	} catch {
		return; // token not ready → skip, next tick will retry if needed
	}

	const uid = user.uid;

	const db = await getDbClient();
	const { doc, getDoc, setDoc, serverTimestamp } = await fs();
	const userRef = doc(db, "users", uid);

	let userSnap;
	try {
		userSnap = await getDoc(userRef);
	} catch (err) {
		const code = err?.code || "";
		if (code === "permission-denied" || code === "unauthenticated") return; // transition window
		logError("fs:CreateUserDoc:getDoc", err);
		throw err;
	}
	if (!userSnap.exists()) {
		try {
			info("SetDoc attempting");
			await setDoc(
				userRef,
				{
					displayName: user.displayName || "null",
					email: user.email,
					maxID: 0,
					createdAt: serverTimestamp(),
					cards: [],
				},
				{ merge: true }
			); // safe if something wrote a partial doc earlier
		} catch (err) {
			const code = err?.code || "";
			if (code === "permission-denied" || code === "unauthenticated") return;
			logError("fs:CreateUserDoc:setDoc", err);
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
	const db = await getDbClient();
	const { doc, runTransaction, arrayUnion } = await fs();
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
	const db = await getDbClient();
	const { doc, runTransaction } = await fs();
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
	const db = await getDbClient();
	const { doc, getDoc, updateDoc } = await fs();
	const userRef = doc(db, "users", uid);
	const userSnap = await getDoc(userRef);
	if (userSnap.exists()) {
		await updateDoc(userRef, { cards: filteredCards });
	} else throw new Error("User not found");
}

export async function deleteAllCards(user) {
	const uid = requireUid(user);
	const db = await getDbClient();
	const { doc, getDoc, updateDoc } = await fs();
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
	const db = await getDbClient();
	const { doc, runTransaction } = await fs();
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
