import { createContext, useContext, useRef, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
	const editingLockRef = useRef(false);
	const [isEditingLock, setIsEditingLock] = useState(false);

	return (
		<UIContext.Provider
			value={{ editingLockRef, isEditingLock, setIsEditingLock }}
		>
			{children}
		</UIContext.Provider>
	);
};

export const useUI = () => useContext(UIContext);
