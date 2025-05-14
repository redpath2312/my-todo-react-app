import react, { useState } from "react";
import { useAuth } from "../AuthContext";
const ForgotPwdForm = () => {
	const [email, setEmail] = useState("");
	const { handleForgotPwd } = useAuth();

	const handleSubmitForgotPwdClick = async (e) => {
		e.preventDefault();
		console.log("Sending forgot password request to", email);

		try {
			await handleForgotPwd(email);
		} catch (error) {
			console.error("request failed", error.message);
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

				<button type="submit" className="send-button">
					Send
				</button>
			</div>
		</form>
	);
};

export default ForgotPwdForm;
