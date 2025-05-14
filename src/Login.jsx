import React from "react";
import LoginForm from "./Components/LoginForm";
import SocialLogin from "./Components/SocialLogin";
import Footer from "./Components/Footer";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
	const {
		// userErrorInfo,
		// handleEmailLogin,
		// handleRegister,
		// handleLogout,
		handleGuestSignIn,
	} = useAuth();

	const handleGuestClick = () => {
		handleGuestSignIn();
	};
	return (
		<div className="login-page-full">
			<div className="login-page">
				<div className="login-section">
					<div className="login-container">
						<h2 className="form-title">Log in with</h2>
						<SocialLogin />

						<hr className="or-divider"></hr>

						<LoginForm />

						<hr className="or-divider"></hr>

						<div className="no-account-section">
							<div className="no-account-text small-text">
								<p> Don't have an account?</p>
								<Link to="/guest" onClick={handleGuestClick}>
									Try now as a guest
								</Link>
							</div>
							<div className="no-account-text small-text">
								<p> Want full features?</p>
								<Link to="/register">Sign up now</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="image-background">
					<img
						src="images/logo.JPG"
						alt="Dash Tasker"
						className="image-hero"
					></img>
				</div>
			</div>
			<div>
				<Footer />
			</div>
		</div>
	);
};

export default Login;
