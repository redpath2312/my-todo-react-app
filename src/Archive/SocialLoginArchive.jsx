// import React from "react";
// import { useAuth } from "../AuthContext";

// const SocialLogin = () => {
// 	const { handleSocialAuthRedirect, handleGoogleLogin } = useAuth();

// 	const handleSocialLoginClick = (providerID) => {
// 		handleSocialAuthRedirect(providerID);
// 	};

// 	return (
// 		<div className="social-login">
// 			<button
// 				className="social-button"
// 				onClick={() => handleSocialLoginClick("google")}
// 				// onClick={() => handleGoogleLogin()}
// 			>
// 				<img src="images/google.svg" alt="Google" className="social-icon" />
// 				Google
// 			</button>
// 			<button
// 				className="social-button"
// 				onClick={() => handleSocialLoginClick("facebook")}
// 			>
// 				<img src="images/facebook.svg" alt="facebook" className="social-icon" />
// 				facebook
// 			</button>
// 		</div>
// 	);
// };

// export default SocialLogin;

// SocialLogin.jsx

// import { useNavigate } from "react-router-dom";
// import {
// 	setPersistence,
// 	browserSessionPersistence,
// 	signInWithRedirect,
// 	GoogleAuthProvider,
// 	FacebookAuthProvider,
// } from "firebase/auth";
// import { auth } from "../firebaseconfig";
// import { setRedirectIntent } from "../utils/redirectIntent";
// import { useAuth } from "../AuthContext";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
const facebookProvider = new FacebookAuthProvider();
const providers = { google: googleProvider, facebook: facebookProvider };

export default function SocialLogin() {
	const nav = useNavigate();
	const { handleGoogleLogin } = useAuth();

	const beginRedirect = async (id) => {
		const provider = providers[id];
		if (!provider) return;

		setRedirectIntent(id); // mark intent (string + ts)
		try {
			await setPersistence(auth, browserSessionPersistence);
		} catch (error) {
			console.error(error, ": "`${error.message}`);
		}

		nav("/auth/callback", { replace: true }); // go neutral first
		setTimeout(() => signInWithRedirect(auth, provider), 0); // then kick off
	};

	return (
		<div className="social-login">
			<button
				className="social-button"
				onClick={() => handleGoogleLogin("google")}
			>
				<img src="images/google.svg" alt="Google" className="social-icon" />{" "}
				Google
			</button>
			{/* <button className="social-button" onClick={() => beginRedirect("google")}>
				<img src="images/google.svg" alt="Google" className="social-icon" />{" "}
				Google
			</button> */}
			{/* Disabled facebook as will need consent and auth via redirect working */}
			{/* <button
				className="social-button"
				onClick={() => beginRedirect("facebook")}
			>
				<img src="images/facebook.svg" alt="facebook" className="social-icon" />{" "}
				facebook
			</button> */}
		</div>
	);
}
