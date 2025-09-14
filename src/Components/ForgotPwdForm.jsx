import { useState } from "react";
import PrimaryButton from "./Buttons/PrimaryButton";
import { useAuth } from "../AuthContext";
const ForgotPwdForm = () => {
	const [email, setEmail] = useState("");
	const { handleForgotPwd } = useAuth();
	const [isSending, setIsSending] = useState(false);

	const handleSubmitForgotPwdClick = async (e) => {
		e.preventDefault();
		console.log("Sending forgot password request to", email);
		setIsSending(true);
		try {
			await handleForgotPwd(email);
		} catch (error) {
			console.error("request failed", error.message);
		} finally {
			setIsSending(false);
		}
	};

	return (
		<form className="forgotpwd-form" onSubmit={handleSubmitForgotPwdClick}>
			<div>
				<div className="input">
					<input
						type="email"
						name="email"
						placeholder="Email address"
						className="input-field"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<i className="material-symbols-rounded">mail</i>
				</div>

				<PrimaryButton
					type="submit"
					variant="contained"
					color="primary"
					size="large"
					disabled={isSending || !email}
				>
					{`${isSending ? "Sending..." : "Send"}`}
				</PrimaryButton>
				{/* 
				<button
					className={`send-button${isSending ? " is-sending" : ""}`}

				</button> */}
			</div>
		</form>
	);
};

export default ForgotPwdForm;
