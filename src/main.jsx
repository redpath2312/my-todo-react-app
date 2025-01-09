import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { initializeApp } from "firebase/app";

import {
	getFirestore,
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
	connectFirestoreEmulator,
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);

const firestore = getFirestore();
connectFirestoreEmulator(firestore, "localhost", 8080);

console.log("Hi firestore");
const testDoc = doc(firestore, "testCollection/testList");

function writeList(cards) {
	const docData = { cards };
	setDoc(testDoc, docData, { merge: true })
		.then(() => {
			console.log("Cards successfully written to Firestore!");
		})
		.catch((error) => {
			console.error("Error writing document: ", error);
		});
}

async function ReadList() {
	const docSnap = await getDoc(testDoc);
	if (docSnap.exists()) {
		const docData = docSnap.data();
		console.log(`My doc data is ${JSON.stringify(docData)}`);
		const formattedCards = docData.cards;
		console.log(formattedCards);
	}
}

ReadList();
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App onDBAdd={writeList} />
	</StrictMode>
);
