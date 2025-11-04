import { GoogleAuthProvider } from "firebase/auth";
import { useAuth } from "../AuthContext";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default function SocialRegister() {
	const { handleGoogleLogin, authBusy } = useAuth();

	return (
		<>
			<div className="social-login">
				<button
					className="social-button"
					disabled={authBusy}
					onClick={() => handleGoogleLogin("google")}
				>
					<img
						src="images/google.svg"
						alt="Google"
						className="social-icon"
						height="32"
						width="32"
						decoding="async"
					/>{" "}
					{authBusy ? "Opening Google…" : "Google"}
					{authBusy && (
						<span
							className="ml-2 inline-block h-3 w-3 rounded-full border-2 border-current border-r-transparent animate-spin align-[-0.125em]"
							aria-hidden="true"
						/>
					)}
				</button>
			</div>
			{/* reserve ~2 lines so the form width/height doesn't jump */}
			<div className="mt-2 min-h-[32px] flex justify-center">
				<p
					role="status"
					aria-live="polite"
					className={[
						"small-text",
						"muted", // keep your size/color
						authBusy ? "block" : "hidden",
						"text-center leading-snug", // nicer wrapping
						"max-w-[260px] sm:max-w-[300px] break-words", // prevent widening
					].join(" ")}
				>
					We opened a Google window. If you don&apos;t see it, check your other
					desktop/Spaces or allow pop-ups for this site.
				</p>
			</div>
		</>
	);
}
