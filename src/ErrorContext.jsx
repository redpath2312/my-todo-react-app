import { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
	const [errors, setErrors] = useState([]);

	const addError = (msg) => {
		setErrors((prev) => {
			const updated = [...prev, { id: Date.now(), msg }];
			return updated.slice(-5); //Keep last 5
		});
	};

	const dismissError = (id) => {
		setErrors((prev) => prev.filter((err) => err.id !== id));
	};

	return (
		<ErrorContext.Provider value={{ errors, addError, dismissError }}>
			{children}
		</ErrorContext.Provider>
	);
};

export const useError = () => useContext(ErrorContext);
