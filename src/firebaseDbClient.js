import { getFirebaseApp } from "./firebaseApp";
import { devDebug } from "./utils/logger";
import { connectDbEmulator } from "./firebaseEmulators";
let dbPromise = null;

export async function getDbClient() {
	if (dbPromise) return dbPromise;
	dbPromise = (async () => {
		devDebug("[DB] getDbClient called");
		const firebaseApp = await getFirebaseApp();
		devDebug("[DB] got app", firebaseApp?.name);
		const { initializeFirestore, setLogLevel, memoryLocalCache } = await import(
			"firebase/firestore"
		);

		// 👇 Force long-polling; avoid streaming/WebChannel issues behind VPNs/proxies
		const db = initializeFirestore(firebaseApp, {
			experimentalForceLongPolling: true,
			cache: memoryLocalCache ? memoryLocalCache() : undefined,
		});
		await connectDbEmulator(db);

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
		return db;
	})();
	return dbPromise;
}
export function fs() {
	return import("firebase/firestore");
}
