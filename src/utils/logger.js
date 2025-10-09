// allow console in this one helper file only -override setup in lint config

// Decide when to be chatty
const isDevServer = import.meta.env.DEV; // vite dev
const isDevPreview =
	import.meta.env.MODE === "devpreview" ||
	import.meta.env.VITE_ENV_NAME === "devpreview";

const debugFlagEnv = import.meta.env.VITE_DEBUG_LOGS; // "true" | "false" | undefined
export const debugEnabled =
	debugFlagEnv != null ? debugFlagEnv === "true" : isDevServer || isDevPreview;

// Public API
export const log = (...args) => {
	if (debugEnabled) console.log(...args);
};
export const info = (...args) => {
	if (debugEnabled) console.info(...args);
};
export const warn = (...args) => console.warn(...args); // allowed by your lint
export const error = (...args) => console.error(...args); // allowed by your lint

// Optional niceties
export const trace = (tag, payload) => {
	if (debugEnabled) console.info(`[TRACE] ${tag}`, payload);
};
export const time = (label) => {
	if (debugEnabled) console.time(label);
};
export const timeEnd = (label) => {
	if (debugEnabled) console.timeEnd(label);
};
export const devDebug = (...a) => {
	if (import.meta.env.DEV) console.debug(...a);
};
export const devWarn = (...a) => {
	if (import.meta.env.DEV) console.warn(...a);
};
