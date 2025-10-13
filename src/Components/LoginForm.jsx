import { useState } from "react";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import PrimaryButton from "./Buttons/PrimaryButton";
import { IconButton } from "@mui/material";
import MailOutlineRounded from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
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

		try {
			await handleEmailLogin({ email, password });
		} catch (error) {
			console.error("login failed", error.message);
		}
	};

	return (
		<form action="#" className="login-form" onSubmit={handleEmailLoginSubmit}>
			{/* EMAIL */}
			<div className="input relative">
				<input
					type="email"
					name="email"
					autoComplete="email"
					placeholder="Email address"
					className="input-field pl-10"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>

				<MailOutlineRounded
					fontSize="small"
					aria-hidden="true"
					className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"
				/>
			</div>

			{/* PASSWORD */}
			<div className="input relative">
				<input
					type={isPasswordVisible ? "text" : "password"}
					name="password"
					autoComplete="current-password"
					placeholder="Password"
					className="input-field pl-10 pr-10"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				<LockOutlinedIcon
					fontSize="small"
					aria-hidden="true"
					className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none  text-neutral-500"
				/>
				<IconButton
					onClick={onEyeIconClick}
					aria-label={isPasswordVisible ? "Hide password" : "Show password"}
					size="small"
					disableRipple
					className="!absolute !right-2 !top-1/2 !-translate-y-1/2 !p-1 !text-neutral-400 hover:!bg-transparent focus:!outline-none"
				>
					{isPasswordVisible ? (
						<VisibilityRounded fontSize="small" className="!text-inherit" />
					) : (
						<VisibilityOffRounded fontSize="small" className="!text-inherit" />
					)}
				</IconButton>
			</div>
			<div className="small-text">
				<Link to="/forgotpwd">Forgot Password?</Link>
			</div>

			<PrimaryButton type="submit">Log In</PrimaryButton>
		</form>
	);
};

export default LoginForm;
