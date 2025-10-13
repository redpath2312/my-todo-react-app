import { useState } from "react";
import PrimaryButton from "./Buttons/PrimaryButton";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import { useAuth } from "../AuthContext";
const ForgotPwdForm = () => {
	const [email, setEmail] = useState("");
	const { handleForgotPwd } = useAuth();
	const [isSending, setIsSending] = useState(false);

	const handleSubmitForgotPwdClick = async (e) => {
		e.preventDefault();
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
						autoComplete="email"
						className="input-field"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<MailOutlineRounded
						fontSize="small"
						aria-hidden="true"
						className="absolute left-3 top-1/2 -translate-y-3/4 pointer-events-none text-neutral-500"
					/>
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
			</div>
		</form>
	);
};

export default ForgotPwdForm;
