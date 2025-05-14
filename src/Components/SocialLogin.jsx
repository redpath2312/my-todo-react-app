import React from "react";
import { useAuth } from "../AuthContext";

const SocialLogin = () => {
	const { handleSocialAuthRedirect } = useAuth();

	const handleSocialLoginClick = (providerID) => {
		handleSocialAuthRedirect(providerID);
	};

	return (
		<div className="social-login">
			<button
				className="social-button"
				onClick={() => handleSocialLoginClick("google")}
			>
				<img src="images/google.svg" alt="Google" className="social-icon" />
				Google
			</button>
			<button
				className="social-button"
				onClick={() => handleSocialLoginClick("facebook")}
			>
				<img src="images/facebook.svg" alt="facebook" className="social-icon" />
				facebook
			</button>
		</div>
	);
};

export default SocialLogin;
