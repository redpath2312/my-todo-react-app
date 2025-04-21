import React from "react";
import { useAuth } from "../AuthContext";

const SocialLogin = () => {
	const { handleGoogleAuth } = useAuth();
	const handleGoogleLoginClick = () => {
		handleGoogleAuth();
	};

	return (
		<div className="social-login">
			<button className="social-button" onClick={handleGoogleLoginClick}>
				<img src="google.svg" alt="Google" className="social-icon" />
				Google
			</button>
			<button className="social-button">
				<img src="apple.svg" alt="Apple" className="social-icon" />
				Apple
			</button>
			<button className="social-button">
				<img src="facebook.svg" alt="facebook" className="social-icon" />
				facebook
			</button>
		</div>
	);
};

export default SocialLogin;
