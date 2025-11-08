// services/firestoreUser.js (add tiny compatibility + logs)
import {
	doc,
	getDoc,
	setDoc,
	updateDoc,
	serverTimestamp,
} from "firebase/firestore";

const isMissingName = (v) => {
	if (v == null) return true;
	const s = String(v).trim().toLowerCase();
	return !s || s === "null" || s === "anonymous";
};

export async function ensureDisplayName(db, user, nameFromForm = null) {
	const uid = user?.uid;
	if (!uid) return; // guest / loggedOut — nothing to do

	const ref = doc(db, "users", user.uid);

	try {
		const snap = await getDoc(ref);

		// best available name; strip literal "null"
		let authName = ((nameFromForm ?? user.displayName ?? "") + "").trim();
		if (authName.toLowerCase() === "null") authName = "";

		if (!snap.exists()) {
			await setDoc(
				ref,
				{
					displayName: authName || null, // ok to start null; we’ll patch on next auth tick
					email: user.email || null,
					maxID: 0,
					cards: [],
					createdAt: serverTimestamp(),
					updatedAt: serverTimestamp(),
				},
				{ merge: true }
			);
			return;
		}

		const cur = snap.data() || {};
		if (authName && isMissingName(cur.displayName)) {
			await updateDoc(ref, {
				displayName: authName,
				updatedAt: serverTimestamp(),
			});
		}
	} catch (err) {
		const code = err?.code || "";
		// Expected while auth is flipping to guest/loggedOut
		if (code === "permission-denied" || code === "unauthenticated") return;
		throw err; // only surface real errors
	}
}
