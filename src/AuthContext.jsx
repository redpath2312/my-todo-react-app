import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebaseconfig";
import {
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	signInWithEmailAndPassword,
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
			const userCredential = await signInWithEmailAndPassword(
				auth,
				loginEmail,
				loginPassword
			);
			setUserErrorInfo("");
			setUser(userCredential.user);
			// setUserState("loggedIn");
			setUserState((prev) => (prev === "loggedIn" ? "refreshing" : "loggedIn"));
			console.log(userCredential.user);
		} catch (error) {
			console.log(error);
			setUserErrorInfo(error.message);
			throw error;
		}
	};

	// Register new user
	const handleRegister = async (email, password) => {
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			setUser(userCredential.user);
			setUserState("loggedIn");
		} catch (error) {
			console.error("Registration failed:", error.message);
		}
	};

	// Logout
	const handleLogout = async () => {
		await signOut(auth);
		setUser(null);
		setUserState("loggedOut");
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
				handleLogout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
