import { createContext, useContext, useRef, useState } from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
	const editingLockRef = useRef(false);
	const [editingLocked, setEditingLocked] = useState(false);

	const lockEditing = () => {
		editingLockRef.current = true;
		setEditingLocked(true);
	};

	const unlockEditing = () => {
		editingLockRef.current = false;
		setEditingLocked(false);
	};

	return (
		<UIContext.Provider
			value={{ editingLockRef, editingLocked, lockEditing, unlockEditing }}
		>
			{children}
		</UIContext.Provider>
	);
};
// eslint-disable-next-line react-refresh/only-export-components
export const useUI = () => useContext(UIContext);
