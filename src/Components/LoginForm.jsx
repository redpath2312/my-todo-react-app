import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import PrimaryButton from "./Buttons/PrimaryButton";
const LoginForm = () => {
	const { handleEmailLogin } = useAuth();
	const [isPasswordVisible, setPasswordVisible] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const onEyeIconClick = () => {
		setPasswordVisible(!isPasswordVisible);
	};

	const handleEmailLoginSubmit = async (e) => {
		e.preventDefault();
		console.log("Trying to log in with", email, password);

		try {
			await handleEmailLogin({ email, password });
		} catch (error) {
			console.error("login failed", error.message);
		}
	};

	return (
		<form action="#" className="login-form" onSubmit={handleEmailLoginSubmit}>
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
			<div className="input">
				<input
					type={isPasswordVisible ? "text" : "password"}
					name="password"
					placeholder="Password"
					className="input-field"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<i className="material-symbols-rounded">lock</i>
				<i
					className="material-symbols-rounded eye-icon"
					onClick={onEyeIconClick}
				>
					{isPasswordVisible ? "visibility" : "visibility_off"}
				</i>
			</div>
			<div className="small-text">
				<Link to="/forgotpwd">Forgot Password?</Link>
			</div>

			{/* <a className="small-text" href="#">
				Forgot Password?
			</a> */}
			<PrimaryButton type="submit">Log In</PrimaryButton>
		</form>
	);
};

export default LoginForm;
