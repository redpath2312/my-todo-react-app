import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebaseconfig";
import { useAlert } from "./ErrorContext";
import { createUserDoc } from "./FirestoreService";

import {
	createUserWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	updateProfile,
	GoogleAuthProvider,
	FacebookAuthProvider,
	signInWithRedirect,
	getRedirectResult,
	sendPasswordResetEmail,
} from "firebase/auth";

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export const AuthProvider = ({ children }) => {
	const { addAlert } = useAlert();
	const [user, setUser] = useState(null);
	const [userState, setUserState] = useState("checking");

	// Handle Firebase Auth state changes
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			// console.log("onAuthStateChanged fired. User:", user);
			if (user) {
				setUser(user);
				setUserState("loggedIn");
			} else if (localStorage.getItem("guest") === "true") {
				setUser(null); // still clear out any lingering user
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
			const loginEmail = creds.email;
			const loginPassword = creds.password;
			const loginDisplayName = creds.displayName;
			const userCredential = await signInWithEmailAndPassword(
				auth,
				loginEmail,
				loginPassword,
				loginDisplayName
			);
			console.log(userCredential.user);
			setUser(userCredential.user);
			setUserState("loggedIn");
		} catch (error) {
			addAlert(error.message);
			throw error;
		}
	};

	// Register new user
	const handleRegister = async (creds) => {
		try {
			const registerEmail = creds.email;
			const registerPassword = creds.password;
			const registerDisplayName = creds.displayName;
			console.log(registerDisplayName);

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				registerEmail,
				registerPassword
			);
			await updateProfile(userCredential.user, {
				displayName: registerDisplayName,
			});
			// Refresh the user to get the updated displayName
			// await userCredential.user.reload();
			// const updatedUser = auth.currentUser;
			// setUser(updatedUser);
			// setUserState("loggedIn");

			// await updateProfile(userCredential.user, {
			// 	displayName: registerDisplayName,
			// });
			setUser({
				...userCredential.user,
				displayName: registerDisplayName,
			});
			setUserState("loggedIn");
			await handlePostLoginSetup(userCredential.user);
		} catch (error) {
			console.error("Registration failed:", error.message);
			addAlert(error.message);
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
		}
	};

	const handleGuestSignIn = () => {
		setUser(null);
		localStorage.setItem("guest", true); //so client can remember it is in guest mode
		setUserState("guest");
	};

	const handleForgotPwd = async (email) => {
		// console.log("Sending reset email to: ", email);
		await sendPasswordResetEmail(auth, email)
			.then(() => {
				console.log("Password reset email sent");
				// Password reset email sent!
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				alert(`Error: ${errorCode} :${errorMessage}`);
				addAlert(error.message);
			});
	};

	// new redirect handler for multiple providers
	const handleSocialAuthRedirect = (providerID) => {
		let providerMap = {
			google: googleProvider,
			facebook: facebookProvider,
		};
		const provider = providerMap[providerID];
		if (!provider) {
			console.error("Invalid Provider ID: ", providerID);
			alert("Invalid Login type");
			return;
		}
		signInWithRedirect(auth, provider);
	};

	//provider specific redirects

	const handlePostLoginSetup = async (user) => {
		try {
			await createUserDoc(user);
		} catch (error) {
			console.log(
				"Error ensuring user doc exists after login: ",
				error.message
			);
		}
	};

	useEffect(() => {
		const handleRedirectResult = async () => {
			try {
				const result = await getRedirectResult(auth);
				// console.log("getRedirectResult fired");
				if (!result) {
					console.log("No redirect result");
					return;
				}
				// Avoid errors on first load with no redirect result

				// The signed-in user info.
				const newUser = result.user;
				setUser(newUser);
				setUserState("loggedIn");
				await handlePostLoginSetup(newUser);
			} catch (error) {
				console.log("Redirect Login Error failed", error.message);
				addAlert("Redirect Login Error failed", error.message);
			}
		};
		handleRedirectResult();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				userState,
				handleEmailLogin,
				handleRegister,
				handleLogOut,
				handleGuestSignIn,
				handleSocialAuthRedirect,
				handleForgotPwd,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
