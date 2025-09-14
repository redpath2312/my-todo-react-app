import { GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "../AuthContext";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default function SocialLogin() {
	const { handleGoogleLogin } = useAuth();

	return (
		<div className="social-login">
			<button
				className="social-button"
				onClick={() => handleGoogleLogin("google")}
			>
				<img src="images/google.svg" alt="Google" className="social-icon" />{" "}
				Google
			</button>
		</div>
	);
}
