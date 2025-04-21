import React from "react";
import { useAuth } from "../AuthContext";
const SocialRegister = () => {
	const { handleGoogleAuth, handleFacebookAuth } = useAuth();
	const handleGoogleRegClick = () => {
		handleGoogleAuth();
	};

	const handleFacebookRegClick = () => {
		handleFacebookAuth();
	};
	return (
		<div className="social-register">
			<button className="social-button" onClick={handleGoogleRegClick}>
				<img src="google.svg" alt="Google" className="social-icon" />
				Google
			</button>
			{/* <button className="social-button">
				<img src="apple.svg" alt="Apple" className="social-icon" />
				Apple
			</button> */}
			<button className="social-button" onClick={handleFacebookRegClick}>
				<img src="facebook.svg" alt="facebook" className="social-icon" />
				facebook
			</button>
		</div>
	);
};

export default SocialRegister;
