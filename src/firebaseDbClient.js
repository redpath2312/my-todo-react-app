import { getFirebaseApp } from "./firebaseApp";
import { devDebug } from "./utils/logger";

let dbPromise = null;

export async function getDbClient() {
	if (dbPromise) return dbPromise;
	dbPromise = (async () => {
		devDebug("[DB] getDbClient called");
		const firebaseApp = await getFirebaseApp();
		devDebug("[DB] got app", firebaseApp?.name);
		const {
			initializeFirestore,
			connectFirestoreEmulator,
			setLogLevel,
			memoryLocalCache,
		} = await import("firebase/firestore");

		// 👇 Force long-polling; avoid streaming/WebChannel issues behind VPNs/proxies
		const db = initializeFirestore(firebaseApp, {
			experimentalForceLongPolling: true,
			cache: memoryLocalCache ? memoryLocalCache() : undefined,
		});
		const useDbEmu = import.meta.env.VITE_USE_DB_EMULATOR === "true";

		// Optional manual override: VITE_FIRESTORE_LOG (debug | error | silent)
		const manual = import.meta.env.VITE_FIRESTORE_LOG;

		if (manual) {
			setLogLevel(manual); // trust your override
		} else if (import.meta.env.DEV) {
			setLogLevel("debug"); // local dev
		} else if (import.meta.env.MODE === "devpreview") {
			setLogLevel("error"); // show only errors on preview
		} else {
			setLogLevel("silent"); // prod: no Firestore noise
		}
		//      * HARD GUARD: never allow emulator connections in a production build.
		//  * If a prod bundle is shipped with emulator flags accidentally set, throw immediately.
		if (import.meta.env.PROD && useDbEmu) {
			// You can swap to console.error + no-ops if you prefer fail-soft, but fail-fast is safest.
			throw new Error(
				"[Firebase init] Firestore DB Emulator enabled in PRODUCTION build. " +
					"Check .env.production (VITE_USE_DB_EMULATOR should be false)."
			);
		}

		//		 * DEV-ONLY emulator wiring.
		//	 * This ensures emulators only connect during vite dev / non-prod builds.

		if (!import.meta.env.PROD && useDbEmu) {
			const port = Number(import.meta.env.VITE_DB_EMULATOR_PORT || 8080);
			connectFirestoreEmulator(db, "127.0.0.1", port);
			devDebug(`[DB] emulator connected on 127.0.0.1:${port}`);
		}
		return db;
	})();
	return dbPromise;
}
export function fs() {
	return import("firebase/firestore");
}
