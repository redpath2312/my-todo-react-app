import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useAlert } from "../ErrorContext";
import ErrorDisplay from "./ErrorDisplay";
import PrimaryButton from "./Buttons/PrimaryButton";
import { error as logError } from "../utils/logger";

const RegisterForm = () => {
	const { handleRegister } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const { addAlert } = useAlert();

	const handleRegisterClick = async (e) => {
		e.preventDefault();
		//Check for confirm password

		if (password == confirmPassword) {
			try {
				await handleRegister({ email, password, displayName });
			} catch (err) {
				logError("Error Registering", err.message);
				addAlert("Error Registering", err.message);
			}
		} else {
			addAlert("Passwords don't match", "warn", 4000);
		}
	};

	return (
		<form action="#" className="register-form" onSubmit={handleRegisterClick}>
			<div className="input">
				<input
					type="text"
					name="displayName"
					placeholder="Display Name"
					autoComplete="name"
					className="input-field"
					value={displayName}
					onChange={(e) => setDisplayName(e.target.value)}
					required
				/>
			</div>
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
			</div>
			<div className="input">
				<input
					type="password"
					name="password"
					placeholder="Password"
					autoComplete="new-password"
					className="input-field"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>

			<div className="input">
				<input
					type="password"
					name="confirmpassword"
					placeholder="Confirm Password"
					className="input-field"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
				/>
			</div>
			<PrimaryButton type="submit">Register</PrimaryButton>
			<ErrorDisplay />
		</form>
	);
};

export default RegisterForm;
