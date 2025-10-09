import { createContext, useContext, useState, useEffect } from "react";
import { useAlert } from "./ErrorContext";
import { error as logError } from "./utils/logger";
import { useRef } from "react";
import {
	setRedirectIntent,
	getRedirectIntent,
	clearRedirectIntent,
} from "./utils/redirectIntent";

import { useLocation } from "react-router-dom";
import { getAuthClient } from "./firebaseAuthClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const { pathname } = useLocation();
	const { addAlert } = useAlert();
	const addAlertRef = useRef(addAlert);
	const [user, setUser] = useState(null);
	const [userState, setUserState] = useState(
		localStorage.getItem("guest") === "true" ? "guest" : "checking"
	);

	useEffect(() => {
		if (pathname === "/guest") return;

		let unsub;

		const run = async () => {
			const auth = await getAuthClient(); //lazy
			const { getRedirectResult, onAuthStateChanged } = await import(
				"firebase/auth"
			); //lazy
			try {
				await getRedirectResult(auth);
			} catch (err) {
				logError("Redirect login error", err);
				addAlertRef.current(
					`Redirect login failed: [${err?.code || "unknown"}] ${
						err?.message || ""
					}`,
					"error",
					7000
				);
				clearRedirectIntent();
			}

			unsub = onAuthStateChanged(auth, async (u) => {
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
		};
		run();
		return () => unsub && unsub();
	}, [pathname]);

	//provider specific redirects
	const handleGoogleLogin = async () => {
		// Hoist: get auth once, and load the auth module once.
		const auth = await getAuthClient();
		const {
			GoogleAuthProvider,
			signInWithPopup,
			signInWithRedirect,
			setPersistence,
			browserSessionPersistence,
		} = await import("firebase/auth");
		const googleProvider = new GoogleAuthProvider();
		googleProvider.setCustomParameters({ prompt: "select_account" });
		try {
			const cred = await signInWithPopup(auth, googleProvider);
			await handlePostLoginSetup(cred.user);
			setUser(cred.user);
			setUserState("loggedIn");
		} catch (err) {
			if (
				err?.code === "auth/popup-blocked" ||
				err?.code === "auth/cancelled-popup-request"
			) {
				// fallback to redirect if popup is blocked
				try {
					// getAuthClient already set persistence, but this is harmless + helps Safari/ITP
					await setPersistence(auth, browserSessionPersistence);
				} catch (err) {
					logError(err, ": "`${err.message}`);
				}
				setRedirectIntent("google");
				// optional: navigate("/auth/callback", { replace: true });
				await signInWithRedirect(auth, googleProvider);
				return;
			}
			logError("Google sign-in failed", err);
			addAlert(
				`Google sign-in failed: [${err?.code || "unknown"}] ${
					err?.message || ""
				}`,
				"error",
				6000
			);
		}
	};

	const handleEmailLogin = async (creds) => {
		const auth = await getAuthClient();
		const { signInWithEmailAndPassword } = await import("firebase/auth");
		const loginEmail = creds.email;
		const loginPassword = creds.password;
		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				loginEmail,
				loginPassword
			);
			setUser(userCredential.user);
			setUserState("loggedIn");
			await handlePostLoginSetup(userCredential.user);
		} catch (err) {
			logError(err.message);
			throw err;
		}
	};

	// Register new user
	const handleRegister = async (creds) => {
		const auth = await getAuthClient();
		const { createUserWithEmailAndPassword, updateProfile } = await import(
			"firebase/auth"
		);
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
		} catch (err) {
			logError("Registration failed:", err.message);
			addAlert(err.message);
		}
	};

	const handleLogOut = async () => {
		if (userState === "guest") {
			localStorage.removeItem("guest");
			setUserState("loggedOut");
			return;
		}
		const auth = await getAuthClient();
		const { signOut } = await import("firebase/auth");
		await signOut(auth);
		setUser(null);
		setUserState("loggedOut");
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
		const auth = await getAuthClient();
		const { sendPasswordResetEmail } = await import("firebase/auth");
		try {
			await sendPasswordResetEmail(auth, email);
			addAlert(
				`If an account exists for ${email}, a reset link has been sent (check spam).`,
				"info",
				6000
			);
		} catch (err) {
			const msg =
				err?.code === "auth/invalid-email"
					? "That doesn’t look like a valid email."
					: `[${err?.code || "unknown"}] ${
							err?.message || "Couldn’t send reset email."
					  }`;
			logError("sendPasswordResetEmail failed", err);
			addAlert(msg, "error", 7000);
		}
	};

	const handlePostLoginSetup = async (user) => {
		console.info("handlePostLogin Started");
		try {
			const { createUserDoc } = await import("./FirestoreService");
			await createUserDoc(user);
		} catch (err) {
			logError("Error ensuring user doc exists after login: ", err.message);
		}
	};

	useEffect(() => {
		addAlertRef.current = addAlert;
	}, [addAlert]);

	return (
		<AuthContext.Provider
			value={{
				user,
				userState,
				handleEmailLogin,
				handleRegister,
				handleLogOut,
				handleGuestSignIn,
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
