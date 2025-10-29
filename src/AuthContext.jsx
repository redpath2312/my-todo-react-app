import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAlert } from "./ErrorContext";
import { devDebug, error as logError, warn, info } from "./utils/logger";
import {
	getRedirectIntent,
	clearRedirectIntent,
	setRedirectIntent,
} from "./utils/redirectIntent";

import { useNavigate, useLocation } from "react-router-dom";
import { getAuthClient } from "./firebaseAuthClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const pathRef = useRef(pathname);

	const { addAlert } = useAlert();
	const addAlertRef = useRef(addAlert);
	const [user, setUser] = useState(null);
	const [userState, setUserState] = useState(
		localStorage.getItem("guest") === "true" ? "guest" : "checking"
	);
	const logoutInFlightRef = useRef(false);
	const logoutSuppressUntilRef = useRef(0);
	const LOGOUT_SUPPRESS_MS = 900;
	const [logoutGateActive, setLogoutGateActive] = useState(false);
	const authInFlightRef = useRef(false);
	const [authBusy, setAuthBusy] = useState(false);
	const POPUP_SOFT_TIMEOUT_MS = 12000;
	const visualBusyTimerRef = useRef(null);
	const lastClickTsRef = useRef(0);
	const CLICK_COOLDOWN_MS = 800;
	const disableRedirect =
		import.meta.env.VITE_DISABLE_REDIRECT_FALLBACK === "true";

	const isLogoutTransitioning = logoutInFlightRef.current || logoutGateActive;
	const lastEnsuredUidRef = useRef(null);

	useEffect(() => {
		pathRef.current = pathname;
	}, [pathname]);

	// helpers (top of file or import)

	function promoteToLoggedIn(u, reason = "observer") {
		setUser(u);
		setUserState("loggedIn");
		devDebug(`[auth] promoted to loggedIn via ${reason}`);
	}
	const getGuest = () => {
		try {
			return localStorage.getItem("guest") === "true";
		} catch {
			return false;
		}
	};
	const clearGuest = () => {
		try {
			localStorage.removeItem("guest");
		} catch (err) {
			const msg = `Failed to remove guest from local storage: ${err.message}`;
			logError(msg);
			addAlertRef.current(msg, "error", 6000);
		}
	};

	function startAuthLock() {
		authInFlightRef.current = true;
		visualBusyTimerRef.current = setTimeout(() => setAuthBusy(true), 150);
	}
	function stopAuthLock() {
		setAuthBusy(false);
		clearTimeout(visualBusyTimerRef.current);
		authInFlightRef.current = false;
	}

	useEffect(() => {
		async function runPostLoginOnce(u) {
			if (!u?.uid) return;
			if (lastEnsuredUidRef.current === u.uid) return; // already done for this session/uid
			lastEnsuredUidRef.current = u.uid;
			try {
				await handlePostLoginSetup(u); // creates user doc idempotently
			} catch (err) {
				logError("[auth] postLogin failed", err);
			}
		}

		let unsub; // ADDED

		(async () => {
			const auth = await getAuthClient(); // lazy
			const { onAuthStateChanged } = await import("firebase/auth"); // ADDED (expanded)
			try {
				if (getRedirectIntent()) {
					const { getRedirectResult } = await import("firebase/auth");
					await getRedirectResult(auth);
					clearRedirectIntent();
				}
			} catch (err) {
				logError("Redirect login error", err);
				addAlertRef.current(
					`Redirect login failed: [${err?.code || "unknown"}] ${
						err?.message || ""
					}`,
					"error",
					7000
				);
			}

			unsub = onAuthStateChanged(auth, async (u) => {
				// If a logout is in progress, ignore any interim *user* emissions.
				// Only accept the terminal `null` and derive guest/loggedOut from storage.
				if (
					logoutInFlightRef.current ||
					Date.now() < logoutSuppressUntilRef.current
				) {
					devDebug(
						"Logout in flight or supression, timestamp = ",
						logoutSuppressUntilRef.current
					);
					if (!u) {
						setUser(null);
						setUserState(getGuest() ? "guest" : "loggedOut");
					}
					return; // ignore truthy `u` during logout
				}

				// ✅ Signed in: promote + route from /login → /dashboard
				if (u && u.uid) {
					// ✅ any real sign-in cancels guest mode
					clearGuest();
					promoteToLoggedIn(u);
					runPostLoginOnce(u);
					if (pathRef.current === "/login") {
						navigate("/dashboard", { replace: true });
					}
					return;
				}

				// ❌ No user: immediately leave "checking"
				setUser(null);
				setUserState(getGuest() ? "guest" : "loggedOut");
			});
		})();

		return () => {
			unsub && unsub();
		};
		// ⬇️ subscribe once on mount; no pathname dependency
	}, [navigate]);

	//provider specific redirects
	const handleGoogleLogin = async () => {
		const now = Date.now();
		if (authInFlightRef.current) return; //ignore double clicks
		if (now - lastClickTsRef.current < CLICK_COOLDOWN_MS) return;
		lastClickTsRef.current = now;
		startAuthLock();
		clearRedirectIntent();
		// Hoist: get auth once, and load the auth module once.
		const auth = await getAuthClient();
		const { GoogleAuthProvider, signInWithPopup, signInWithRedirect } =
			await import("firebase/auth");
		const googleProvider = new GoogleAuthProvider();
		googleProvider.setCustomParameters({ prompt: "select_account" });

		const softTimer = setTimeout(() => {
			// Soft unlock + hint if nothing happened for a while
			stopAuthLock();
			addAlertRef.current(
				"Still waiting for Google window… allow pop-ups or check other desktops.",
				"info",
				6000
			);
		}, POPUP_SOFT_TIMEOUT_MS);

		try {
			await signInWithPopup(auth, googleProvider);
			// Observer will promote; we can optionally navigate once promoted by watching userState in a gate.
		} catch (err) {
			// Handle the 3 popup cases cleanly; don't try redirect
			const code = err?.code || "";
			if (code === "auth/popup-closed-by-user") {
				stopAuthLock();
				addAlertRef.current(
					"Google sign-in was cancelled. Click again to retry.",
					"info",
					4000
				);
				return;
			}
			if (code === "auth/cancelled-popup-request") {
				// A second click arrived; ignore — our single-flight already prevents this
				return;
			}
			if (code === "auth/popup-blocked") {
				if (!disableRedirect) {
					setRedirectIntent("google");
					await signInWithRedirect(auth, googleProvider);
					return;
				}
				stopAuthLock();
				addAlertRef.current(
					"Your browser blocked the Google sign-in window. Allow popups for this site and try again.",
					"warning",
					7000
				);
				return;
			}
			stopAuthLock();
			logError("Google sign-in failed", err);
			addAlertRef.current(
				`Google sign-in failed: [${code || "unknown"}] ${err?.message || ""}`,
				"error",
				7000
			);
		} finally {
			stopAuthLock(); //safety net
			clearTimeout(softTimer);
		}
	};

	const handleEmailLogin = async (creds) => {
		const auth = await getAuthClient();
		const { signInWithEmailAndPassword } = await import("firebase/auth");
		try {
			await signInWithEmailAndPassword(auth, creds.email, creds.password);
			// Observer will promote + postLoginSetup will run when pending is set (redirect) or you can run it after promotion.
		} catch (err) {
			const msg = err.message;
			logError(msg);
			addAlertRef.current(`Failed to login:  ${msg}`, "error", 7000);
			throw err;
		}
	};

	// Register new user
	const handleRegister = async (creds) => {
		if (authInFlightRef.current) return; //ignore double clicks
		startAuthLock();
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
			// Observer will promote; post-setup can be run there (or fire-and-forget here if you prefer)
		} catch (err) {
			const code = err?.code || "";
			if (code === "auth/popup-closed-by-user") {
				stopAuthLock();
				addAlertRef.current(
					"Google sign-in was cancelled. Click again to retry.",
					"info",
					4000
				);
			} else if (code === "auth/cancelled-popup-request") {
				// A second click arrived; ignore — our single-flight already prevents this
			} else if (code === "auth/popup-blocked") {
				stopAuthLock();
				addAlertRef.current(
					"Your browser blocked the Google sign-in window. Allow popups for this site and try again.",
					"warning",
					7000
				);
			} else logError("Registration failed:", err.message);
			addAlertRef.current(err.message);
		} finally {
			stopAuthLock();
		}
	};

	const handleLogOut = async () => {
		const auth = await getAuthClient();
		// Start atomic logout and suppress truthy `u` emissions for 0.9s
		logoutInFlightRef.current = true;
		logoutSuppressUntilRef.current = Date.now() + LOGOUT_SUPPRESS_MS;
		setLogoutGateActive(true); // 🔔 triggers re-render to show “Signing out…”

		// schedule the gate to drop after the window, even if the observer is slow
		setTimeout(() => {
			setLogoutGateActive(false);
		}, LOGOUT_SUPPRESS_MS);

		try {
			const { onAuthStateChanged, signOut } = await import("firebase/auth");

			// Subscribe first so we see the transition to null no matter how fast it happens
			const signedOutPromise = new Promise((resolve) => {
				const stop = onAuthStateChanged(auth, (u) => {
					if (!u) {
						// first time we observe "no user"
						stop(); // detach listener
						resolve(); // continue logout flow
					}
				});
			});

			await signOut(auth); // request sign-out
			await signedOutPromise; // wait until we SEE u === null
		} catch (err) {
			warn("non-fatal error on log out: ", err);
		} finally {
			logoutInFlightRef.current = false;
		}

		clearRedirectIntent();
		try {
			localStorage.removeItem("guest");
		} catch (err) {
			logError("Error removing guest from local storage", err);
		}
		setUser(null);
		setUserState("loggedOut");
		navigate("/login", { replace: true });
	};
	const handleGuestSignIn = async () => {
		const auth = await getAuthClient();
		try {
			if (auth.currentUser) {
				const { signOut, onAuthStateChanged } = await import("firebase/auth");
				await signOut(auth);
				// wait until observer reports null once, so we don't bounce back to loggedIn
				await new Promise((resolve) => {
					const unsub = onAuthStateChanged(auth, (u) => {
						if (!u) {
							unsub();
							resolve();
						}
					});
				});
			}
		} catch (err) {
			warn("Non fatal error on guest sign in: ", err);
		} // non-fatal

		clearRedirectIntent(); // <- in case a previous Google redirect is pending
		setUser(null);
		localStorage.setItem("guest", "true");
		setUserState("guest");
	};

	const handleForgotPwd = async (email) => {
		if (!email) {
			addAlertRef.current("Please enter your email address.", "warning", 4000);
			return;
		}
		const auth = await getAuthClient();
		const { sendPasswordResetEmail } = await import("firebase/auth");
		try {
			await sendPasswordResetEmail(auth, email);
			addAlertRef.current(
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
			addAlertRef.current(msg, "error", 7000);
		}
	};

	const handlePostLoginSetup = async (user) => {
		info("handlePostLogin Started");
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
				isLogoutTransitioning,
				authBusy,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
