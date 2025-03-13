import React from "react";
import LoginForm from "./Components/LoginForm";
import SocialLogin from "./Components/SocialLogin";
import Footer from "./Components/Footer";

const Login = () => {
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
								<a href="guest">Try now as a guest</a>
							</div>
							<div className="no-account-text small-text">
								<p> Want full features?</p>
								<a href="#">Sign up now</a>
							</div>
						</div>
					</div>
				</div>

				<div className="image-background">
					<img src="logo.JPG" alt="Dash Tasker" className="image-hero"></img>
				</div>
			</div>

			<Footer />
		</div>
	);
};

export default Login;
