import React from "react";
const SocialRegister = () => {
	return (
		<div className="social-register">
			<button className="social-button">
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

export default SocialRegister;
