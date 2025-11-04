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

	// NEW: transition/holding-page state
	// e.g. 'checking-auth' | 'loading-app' | 'signing-in' | 'signing-out' | 'switching-to-guest' | null
	const [transitionState, setTransitionState] = useState(null);

	const withTransition = async (state, fn) => {
		setTransitionState(state);
		try {
			return await fn();
		} finally {
			setTransitionState(null);
		}
	};

	return (
		<UIContext.Provider
			value={{
				editingLockRef,
				editingLocked,
				lockEditing,
				unlockEditing,
				transitionState,
				setTransitionState,
				withTransition,
			}}
		>
			{children}
		</UIContext.Provider>
	);
};
// eslint-disable-next-line react-refresh/only-export-components
export const useUI = () => useContext(UIContext);
