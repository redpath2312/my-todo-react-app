import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
	const [alerts, setAlerts] = useState([]);

	const addAlert = (msg, type = "error", timeout = 3000) => {
		const id = crypto.randomUUID();
		setAlerts((prev) => {
			const updated = [...prev, { id, msg, type }];
			return updated.slice(-5); //Keep last 5
		});
		if (timeout) {
			setTimeout(() => {
				clearAlert(id);
			}, timeout);
		}
	};

	let lastAlertTime = 0;
	let lastAlertMsg = "";

	const addThrottledAlert = (
		msg,
		type = "error",
		timeout = 3000,
		throttleGap = 1000
	) => {
		const now = Date.now();

		// Avoid firing if it's the same alert within the gap
		if (now - lastAlertTime < throttleGap && msg === lastAlertMsg) return;

		lastAlertTime = now;
		lastAlertMsg = msg;
		addAlert(msg, type, timeout);
	};

	const clearAlert = (id) => {
		setAlerts((prev) => prev.filter((err) => err.id !== id));
	};

	return (
		<ErrorContext.Provider
			value={{ alerts, addAlert, addThrottledAlert, clearAlert }}
		>
			{children}
		</ErrorContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => useContext(ErrorContext);
