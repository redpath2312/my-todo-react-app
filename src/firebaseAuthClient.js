import { devDebug, error as logError } from "./utils/logger";
import { getFirebaseApp } from "./firebaseApp";

let authPromise = null;

export async function getAuthClient() {
	if (authPromise) return authPromise;

	authPromise = (async () => {
		devDebug("[Auth] getAuthClient called");
		const firebaseApp = await getFirebaseApp();
		devDebug("[Auth] got app", firebaseApp?.name);
		const {
			getAuth,
			setPersistence,
			browserSessionPersistence,
			connectAuthEmulator,
		} = await import("firebase/auth");

		const auth = getAuth(firebaseApp);

		try {
			await setPersistence(auth, browserSessionPersistence);
		} catch (err) {
			logError(err);
		}

		// dev-only emulator (keeps your old behavior)
		const useAuthEmu = import.meta.env.VITE_USE_AUTH_EMULATOR === "true";
		if (import.meta.env.PROD && useAuthEmu) {
			// You can swap to console.error + no-ops if you prefer fail-soft, but fail-fast is safest.
			throw new Error(
				"[Firebase init] Auth Emulator enabled in PRODUCTION build. " +
					"Check .env.production (VITE_USE_AUTH_EMULATOR should be false)."
			);
		}
		/**
		 * DEV-ONLY emulator wiring.
		 * This ensures emulators only connect during vite dev / non-prod builds.
		 */
		if (!import.meta.env.PROD && useAuthEmu) {
			connectAuthEmulator(auth, "http://localhost:9099");
		}
		return auth;
	})();
	return authPromise;
}
