import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebaseconfig";
import { useAlert } from "./ErrorContext";
import { useRef } from "react";
import { createUserDoc } from "./FirestoreService";
import {
	setRedirectIntent,
	getRedirectIntent,
	clearRedirectIntent,
} from "./utils/redirectIntent";

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
	signInWithPopup,
	browserSessionPersistence,
	setPersistence,
} from "firebase/auth";

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

const facebookProvider = new FacebookAuthProvider();

export const AuthProvider = ({ children }) => {
	const { addAlert } = useAlert();
	const addAlertRef = useRef(addAlert);
	const [user, setUser] = useState(null);
	const [userState, setUserState] = useState("checking");

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (u) => {
			const pending = getRedirectIntent();

			if (u) {
				if (pending) {
					try {
						await handlePostLoginSetup(u);
					} catch (e) {
						console.error(e);
					}
					clearRedirectIntent();
					addAlertRef.current(
						`Signed in as ${u.displayName || u.email}`,
						"success",
						3000
					);
				}
				setUser(u);
				setUserState("loggedIn");
				return;
			}

			// No user yet:
			// No user:
			if (pending) {
				// ⛔ HOLD only while *pending* is true.
				// Add a safety timeout so we can't get stuck forever:
				setTimeout(() => {
					if (!auth.currentUser && getRedirectIntent()) {
						// still pending; leave as 'checking'
					} else if (!auth.currentUser && !getRedirectIntent()) {
						// pending cleared and still no user → move on
						setUser(null);
						setUserState(
							localStorage.getItem("guest") === "true" ? "guest" : "loggedOut"
						);
					}
				}, 1500);
				return;
			}

			// Normal no-user path
			setUser(null);
			setUserState(
				localStorage.getItem("guest") === "true" ? "guest" : "loggedOut"
			);
		});

		return () => unsub();
	}, []);

	useEffect(() => {
		getRedirectResult(auth).catch((e) => {
			console.error("Redirect login error", e);
			addAlertRef.current(
				`Redirect login failed: [${e?.code || "unknown"}] ${e?.message || ""}`,
				"error",
				7000
			);
			clearRedirectIntent();
		});
	}, []);

	//provider specific redirects
	const handleGoogleLogin = async () => {
		try {
			const cred = await signInWithPopup(auth, googleProvider);
			await handlePostLoginSetup(cred.user);
			setUser(cred.user);
			setUserState("loggedIn");
		} catch (e) {
			if (
				e?.code === "auth/popup-blocked" ||
				e?.code === "auth/cancelled-popup-request"
			) {
				// fallback to redirect if popup is blocked
				try {
					await setPersistence(auth, browserSessionPersistence);
				} catch (error) {
					console.error(error, ": "`${error.message}`);
				}
				// optional: navigate("/auth/callback", { replace: true });
				await signInWithRedirect(auth, googleProvider);
				return;
			}
			console.error("Google sign-in failed", e);
			addAlert(
				`Google sign-in failed: [${e?.code || "unknown"}] ${e?.message || ""}`,
				"error",
				6000
			);
		}
	};

	// FACEBOOK (redirect) Implement Later
	// const handleFacebookRedirect = async () => {
	// 	try {
	// 		await setPersistence(auth, browserSessionPersistence);
	// 	} catch (error) {console.error(error, ": "`${error.message}`);}
	// 	// optional: setRedirectIntent("facebook"); navigate("/auth/callback", { replace: true });
	// 	await signInWithRedirect(auth, facebookProvider);
	// };

	const handleEmailLogin = async (creds) => {
		try {
			const loginEmail = creds.email;
			const loginPassword = creds.password;
			const userCredential = await signInWithEmailAndPassword(
				auth,
				loginEmail,
				loginPassword
			);
			setUser(userCredential.user);
			setUserState("loggedIn");
			await handlePostLoginSetup(userCredential.user);
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

			const userCredential = await createUserWithEmailAndPassword(
				auth,
				registerEmail,
				registerPassword
			);
			await updateProfile(userCredential.user, {
				displayName: registerDisplayName,
			});
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
		if (!email) {
			addAlert("Please enter your email address.", "warning", 4000);
			return;
		}
		try {
			await sendPasswordResetEmail(auth, email);
			addAlert(
				`If an account exists for ${email}, a reset link has been sent (check spam).`,
				"info",
				6000
			);
		} catch (e) {
			const msg =
				e?.code === "auth/invalid-email"
					? "That doesn’t look like a valid email."
					: `[${e?.code || "unknown"}] ${
							e?.message || "Couldn’t send reset email."
					  }`;
			console.error("sendPasswordResetEmail failed", e);
			addAlert(msg, "error", 7000);
		}
	};

	// new redirect handler for multiple providers
	const handleSocialAuthRedirect = async (providerID) => {
		let providerMap = {
			google: googleProvider,
			facebook: facebookProvider,
		};
		const provider = providerMap[providerID];
		// sessionStorage.setItem("pendingRedirect", providerID);
		if (!provider) {
			console.error("Invalid Provider ID: ", providerID);
			alert("Invalid Login type");
			return;
		}
		setRedirectIntent(providerID); // ✅ string + timestamp + clear guest

		try {
			await setPersistence(auth, browserSessionPersistence);
		} catch (e) {
			console.error("setPersistence(session) failed", e);
			// still attempt redirect; some browsers will allow it anyway
		}

		await signInWithRedirect(auth, provider);
	};

	const handlePostLoginSetup = async (user) => {
		try {
			await createUserDoc(user);
		} catch (error) {
			console.error(
				"Error ensuring user doc exists after login: ",
				error.message
			);
		}
	};

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
				handleGoogleLogin,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
