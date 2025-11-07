// utils/timeElapsed.js

/** Convert a variety of date-ish inputs to a real JS Date. */
export function toJSDate(value) {
	if (!value) return null;
	if (value instanceof Date) return value;
	if (typeof value.toDate === "function") return value.toDate(); // Firestore Timestamp
	if (
		value &&
		typeof value === "object" &&
		typeof value.seconds === "number" &&
		typeof value.nanoseconds === "number"
	) {
		// Firestore Timestamp-like POJO (e.g., after JSON serialization)
		return new Date(value.seconds * 1000 + Math.floor(value.nanoseconds / 1e6));
	}
	const d = new Date(value); // ISO string or epoch millis
	return isNaN(d.getTime()) ? null : d;
}

/**
 * Return a compact "age" label for time elapsed SINCE a fixed event.
 * (Uses coarse granularity: <1h, Nh, Nd, Nmo, Ny)
 *
 * @param {Date} eventAt - FIXED time when the event happened
 * @param {Date} [now=new Date()] - MOVING time for comparison (optional; default current time)
 * @returns {string}
 */

/** Short, humanized elapsed label: "5m", "3h", "2d", "4w", "6mo", "1y" */

export function formatAgeSince(eventAt, now = new Date()) {
	if (!eventAt) return "";
	const ms = Math.max(0, now - eventAt);

	// Guard: if clock skew makes this "future", treat as just now
	if (ms < 0) return "<1h";
	const secs = Math.floor(ms / 1000);
	const mins = Math.floor(secs / 60);
	const hrs = Math.floor(mins / 60);
	const days = Math.floor(hrs / 24);
	if (hrs < 1) return "<1hr";
	if (days < 1) return `${hrs}hr`;
	if (days < 30) return `${days}dy`;

	const mos = Math.floor(days / 30);
	if (days < 365) return `${mos}mo`;
	const yrs = Math.floor(days / 365);
	return `>${yrs}yr`;
}
export function toMillisSafe(v) {
	if (v == null) return 0;
	if (typeof v === "number") return v;
	if (v instanceof Date) return v.getTime();
	if (typeof v?.toMillis === "function") return v.toMillis();
	// Firestore Timestamp-like shape
	if (typeof v.seconds === "number") {
		return v.seconds * 1000 + Math.floor((v.nanoseconds || 0) / 1e6);
	}
	return Number(v) || 0;
}
