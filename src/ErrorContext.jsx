import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
	const [alerts, setAlerts] = useState([]);

	// const addAlert = (msg, type = "error", timeout = null) => {
	// 	setAlerts((prev) => {
	// 		const updated = [...prev, { id: Date.now(), msg, type }];
	// 		return updated.slice(-5); //Keep last 5
	// 	});
	// 	if (timeout) {
	// 		setTimeout(() => {
	// 			clearAlert(id);
	// 		}, timeout);
	// 	}
	// };

	const addAlert = (msg, type = "error", timeout = null) => {
		const id = Date.now();
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

	const clearAlert = (id) => {
		setAlerts((prev) => prev.filter((err) => err.id !== id));
	};

	return (
		<ErrorContext.Provider value={{ alerts, addAlert, clearAlert }}>
			{children}
		</ErrorContext.Provider>
	);
};

export const useAlert = () => useContext(ErrorContext);
