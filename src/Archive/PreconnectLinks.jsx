import { Helmet } from "react-helmet-async";

const AUTH_ORIGIN = `https://${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}`;
export default function PreconnectLinks() {
	return (
		<Helmet>
			{/* hit very early, before routes mount */}
			<link rel="preconnect" href={AUTH_ORIGIN} />
			<link rel="dns-prefetch" href={AUTH_ORIGIN} />
		</Helmet>
	);
}

// // components/PreconnectLinks.jsx
// import { Helmet } from "react-helmet-async";

// function normalizeOrigin(v) {
// 	if (!v) return null;
// 	let s = String(v).trim();
// 	// If it's just a host, add https://. If it already has a scheme, keep it.
// 	if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
// 	// Remove any trailing path/query; keep only origin
// 	try {
// 		const u = new URL(s);
// 		return `${u.protocol}//${u.host}`;
// 	} catch {
// 		// Invalid URL (e.g. typo in env) → disable preconnect
// 		return null;
// 	}
// }

// const AUTH_ORIGIN = normalizeOrigin(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
// console.log(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
// export default function PreconnectLinks() {
// 	// Guard: render nothing if we can’t compute a valid origin
// 	if (!AUTH_ORIGIN) return null;

// 	return (
// 		<Helmet>
// 			<link rel="preconnect" href={AUTH_ORIGIN} />
// 			<link rel="dns-prefetch" href={AUTH_ORIGIN} />
// 		</Helmet>
// 	);
// }
