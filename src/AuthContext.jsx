import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebaseconfig";
import {
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [userState, setUserState] = useState("loggedOut");
	const [userErrorInfo, setUserErrorInfo] = useState("");

	// Handle Firebase Auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				setUserState("loggedIn");
				console.log("just set user state to loggedIn via use effect");
			} else if (localStorage.getItem("guest") === "true") {
				setUserState("guest");
			} else {
				setUser(null);
				setUserState("loggedOut");
			}
		});
		return () => unsubscribe();
	}, []);

	const handleEmailLogin = async (creds) => {
		try {
			console.log(
				"trying to set up creds before calling signInWithEmailAndPassword"
			);
			const loginEmail = creds.email;
			const loginPassword = creds.password;
			const loginDisplayName = creds.displayName;
			const userCredential = await signInWithEmailAndPassword(
				auth,
				loginEmail,
				loginPassword,
				loginDisplayName
			);
			setUserErrorInfo("");
			setUser(userCredential.user);
			// setUserState("loggedIn");
			// setUserState((prev) => (prev === "loggedIn" ? "refreshing" : "loggedIn"));
			setUserState("loggedIn");
			console.log(userCredential.user);
		} catch (error) {
			console.log(error);
			setUserErrorInfo(error.message);
			throw error;
		}
	};

	// Register new user
	const handleRegister = async (creds) => {
		try {
			const registerEmail = creds.email;
			const registerPassword = creds.password;
			const registerDisplayName = creds.displayName;

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				registerEmail,
				registerPassword
			);
			await updateProfile(userCredential.user, {
				displayName: registerDisplayName,
			});
			setUser(userCredential.user);
			setUserState("loggedIn");
		} catch (error) {
			console.error("Registration failed:", error.message);
		}
	};

	// Logout
	const handleLogOut = async () => {
		if (userState === "guest") {
			localStorage.removeItem("guest");
			setUserState("loggedOut");
		} else {
			await signOut(auth);
			setUser(null);
			setUserState("loggedOut");
			console.log("Firebase has now logged you out");
		}
	};

	const handleGuestSignIn = () => {
		setUser(null);
		localStorage.setItem("guest", true); //so client can remember it is in guest mode
		setUserState("guest");
	};

	console.log(userState);

	return (
		<AuthContext.Provider
			value={{
				user,
				userState,
				userErrorInfo,
				handleEmailLogin,
				handleRegister,
				handleLogOut,
				handleGuestSignIn,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
