import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import {
	getAuth,
	setPersistence,
	browserSessionPersistence,
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

// Persist to session (avoids sticky logins across tabs/sessions)
setPersistence(auth, browserSessionPersistence).catch(() => {});

// Read emulator flags from Vite en
const useAuthEmu = import.meta.env.VITE_USE_AUTH_EMULATOR === "true";
const useDbEmu = import.meta.env.VITE_USE_DB_EMULATOR === "true";

/**
 * HARD GUARD: never allow emulator connections in a production build.
 * If a prod bundle is shipped with emulator flags accidentally set, throw immediately.
 */
if (import.meta.env.PROD && (useAuthEmu || useDbEmu)) {
	// You can swap to console.error + no-ops if you prefer fail-soft, but fail-fast is safest.
	throw new Error(
		"[Firebase init] Emulators enabled in PRODUCTION build. " +
			"Check .env.production (VITE_USE_AUTH_EMULATOR / VITE_USE_DB_EMULATOR should be false)."
	);
}
/**
 * DEV-ONLY emulator wiring.
 * This ensures emulators only connect during vite dev / non-prod builds.
 */
if (!import.meta.env.PROD) {
	if (useAuthEmu) {
		connectAuthEmulator(auth, "http://localhost:9099");
	}
	if (useDbEmu) {
		connectFirestoreEmulator(db, "localhost", 8080);
	}
}
export { db, auth };
