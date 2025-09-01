const KEY = "pendingRedirect";
const TS = "pendingRedirectAt";
const TTL = 15_000; // 15s

export function setRedirectIntent(name) {
	sessionStorage.setItem(KEY, name); // 'google' | 'facebook'
	sessionStorage.setItem(TS, String(Date.now()));
	localStorage.removeItem("guest"); // avoid guest racing the handoff
}

export function getRedirectIntent() {
	const name = sessionStorage.getItem(KEY);
	const at = Number(sessionStorage.getItem(TS) || 0);
	return name && Date.now() - at < TTL ? name : null;
}

export function clearRedirectIntent() {
	sessionStorage.removeItem(KEY);
	sessionStorage.removeItem(TS);
}
