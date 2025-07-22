import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useAlert } from "../ErrorContext";
import ErrorDisplay from "./ErrorDisplay";
import PrimaryButton from "./Buttons/PrimaryButton";

const RegisterForm = () => {
	const { handleRegister } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const { addAlert } = useAlert();

	const handleRegisterClick = async (e) => {
		e.preventDefault();
		console.log("Trying to register with", email, password);

		//Check for confirm password

		if (password == confirmPassword) {
			try {
				await handleRegister({ email, password, displayName });
			} catch (error) {
				console.log("Error Registering", error.message);
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
