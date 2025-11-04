import { devDebug } from "./utils/logger";
let appPromise = null;

function cfg() {
	return {
		apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
		authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
		projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
		storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
		appId: import.meta.env.VITE_FIREBASE_APP_ID,
	};
}

export async function getFirebaseApp() {
	if (appPromise) return appPromise;
	appPromise = (async () => {
		const { initializeApp, getApps, getApp } = await import("firebase/app");
		devDebug("firebase initialising");
		const app = getApps().length ? getApp() : initializeApp(cfg());
		devDebug("[App] ready:", app.name);
		return app;
	})();
	return appPromise;
}
