import { useAuth } from "../AuthContext";
const SocialRegister = () => {
	const { handleSocialAuthRedirect } = useAuth();

	const handleSocialLoginClick = (providerID) => {
		handleSocialAuthRedirect(providerID);
	};

	return (
		<div className="social-register">
			<button
				className="social-button"
				onClick={() => handleSocialLoginClick("google")}
			>
				<img src="images/google.svg" alt="Google" className="social-icon" />
				Google
			</button>
			{/* Disabled facebook as need consent and auth via redirect working */}
			{/* <button
				className="social-button"
				onClick={() => handleSocialAuthRedirect("facebook")}
			>
				<img src="images/facebook.svg" alt="facebook" className="social-icon" />
				facebook
			</button> */}
		</div>
	);
};

export default SocialRegister;
