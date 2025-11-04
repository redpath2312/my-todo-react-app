import { devDebug, error as logError } from "./utils/logger";
import { getFirebaseApp } from "./firebaseApp";
import { ensureAuthEmulatorConnected } from "./firebaseEmulators";

let authPromise = null;
let didInit = false;

export async function getAuthClient() {
	if (authPromise) return authPromise;

	authPromise = (async () => {
		devDebug("[Auth] getAuthClient called");
		const firebaseApp = await getFirebaseApp();
		devDebug("[Auth] got app", firebaseApp?.name);
		await ensureAuthEmulatorConnected(firebaseApp);
		const { getAuth, setPersistence, browserLocalPersistence } = await import(
			"firebase/auth"
		);

		const auth = getAuth(firebaseApp);
		if (!didInit) {
			try {
				await setPersistence(auth, browserLocalPersistence);
				didInit = true;
			} catch (err) {
				logError(err);
			}
		}

		return auth;
	})();
	return authPromise;
}
