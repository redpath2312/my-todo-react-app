import React, { useState } from "react";

const LoginForm = () => {
	const [isPasswordVisible, setPasswordVisible] = useState(false);

	const onEyeIconClick = () => {
		setPasswordVisible(!isPasswordVisible);
	};

	return (
		<form action="#" className="login-form">
			<div className="input">
				<input
					type="email"
					placeholder="Email address"
					className="input-field"
					required
				/>
				<i className="material-symbols-rounded">mail</i>
			</div>
			<div className="input">
				{isPasswordVisible ? (
					<input
						type="text"
						placeholder="Password"
						className="input-field"
						required
					/>
				) : (
					<input
						type="password"
						placeholder="Password"
						className="input-field"
						required
					/>
				)}
				<i className="material-symbols-rounded">lock</i>
				{isPasswordVisible ? (
					<i
						className="material-symbols-rounded eye-icon"
						onClick={onEyeIconClick}
					>
						visibility
					</i>
				) : (
					<i
						className="material-symbols-rounded eye-icon"
						onClick={onEyeIconClick}
					>
						visibility_off
					</i>
				)}
			</div>

			<a className="small-text" href="#">
				Forgot Password?
			</a>

			<button className="login-button">Log In</button>
		</form>
	);
};

export default LoginForm;
