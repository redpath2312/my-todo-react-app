// src/firebaseEmulators.js
// One-time, independent connectors with HMR-safe guards.
// Works for any combo:
//   - real Auth + DB emulator
//   - Auth emulator + real DB
//   - both emulators
// Never throws if flags are mixed — just logs.

let flags = (typeof window !== "undefined" && window.__EMU_FLAGS__) || {
	auth: false,
	db: false,
};
if (typeof window !== "undefined") window.__EMU_FLAGS__ = flags;

export async function ensureAuthEmulatorConnected(app) {
	const useAuthEmu = import.meta.env.VITE_USE_AUTH_EMULATOR === "true";

	if (import.meta.env.PROD && useAuthEmu) {
		throw new Error(
			"[Firebase] Auth emulator flag is TRUE in a production build. " +
				"Set VITE_USE_AUTH_EMULATOR=false for prod."
		);
	}
	if (!useAuthEmu || flags.auth) return;

	const { getAuth, connectAuthEmulator } = await import("firebase/auth");
	const auth = getAuth(app);
	// IMPORTANT: call before anyone subscribes/uses auth in your code paths.
	connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
	flags.auth = true;
}

export async function connectDbEmulator(db) {
	const useDbEmu = import.meta.env.VITE_USE_DB_EMULATOR === "true";

	if (import.meta.env.PROD && useDbEmu) {
		throw new Error(
			"[Firebase] Firestore emulator flag is TRUE in a production build. " +
				"Set VITE_USE_DB_EMULATOR=false for prod."
		);
	}
	if (!useDbEmu || flags.db) return;

	const { connectFirestoreEmulator } = await import("firebase/firestore");
	const port = Number(import.meta.env.VITE_DB_EMULATOR_PORT || 8080);
	connectFirestoreEmulator(db, "127.0.0.1", port);
	flags.db = true;
}
