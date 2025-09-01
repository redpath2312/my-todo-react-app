import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
	getAuth,
	setPersistence,
	browserSessionPersistence ,
	connectAuthEmulator,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
// const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

setPersistence(auth, browserSessionPersistence ).catch(() => {});

const useAuthEmu = import.meta.env.VITE_USE_AUTH_EMULATOR === "true";
const useDbEmu = import.meta.env.VITE_USE_DB_EMULATOR === "true";

if (useAuthEmu) connectAuthEmulator(auth, "http://localhost:9099");
if (useDbEmu) connectFirestoreEmulator(db, "localhost", 8080);

export { db, auth };
