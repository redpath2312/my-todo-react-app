import LoginForm from "./Components/LoginForm";
import SocialLogin from "./Components/SocialLogin";
import Footer from "./Components/Footer";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { useAlert } from "./ErrorContext";
import ErrorDisplay from "./Components/ErrorDisplay";
import ThemeModeToggle from "./Components/Buttons/ThemeModeToggle";
import AppMeta from "./Components/AppMeta";
import { useEffect, useRef } from "react";
import { error as logError } from "./utils/logger";

import { useNavigate } from "react-router-dom";

const Login = () => {
	const { addAlert } = useAlert();
	const addAlertRef = useRef(addAlert);
	const { handleGuestSignIn, userState } = useAuth();
	const navigate = useNavigate();

	const clearGuest = () => {
		try {
			localStorage.removeItem("guest");
		} catch (err) {
			const msg = `Failed to remove guest from local storage: ${err.message}`;
			logError(msg);
			addAlertRef.current(msg, "error", 6000);
		}
	};

	useEffect(() => {
		clearGuest;
	}, []);

	useEffect(() => {
		if (userState === "loggedIn") {
			navigate("/dashboard", { replace: true });
		}
		// loggedOut/guest: show the form
	}, [userState, navigate]);

	const handleGuestClick = () => {
		handleGuestSignIn();
	};

	return (
		<>
			<AppMeta
				baseTitle="DashTasker — Login"
				baseDescription="Sign in to manage your Dash Tasks."
			/>
			<div className="login-page-full">
				<div className="login-page">
					<div className="login-section">
						<div className="login-container">
							<div className="panel-toggle">
								<ThemeModeToggle />
							</div>
							<h2 className="form-title">Log in with</h2>
							<SocialLogin />

							<hr className="or-divider"></hr>

							<LoginForm />

							<hr className="or-divider"></hr>

							<div className="no-account-section">
								<div className="no-account-text small-text">
									<p> Don&apos;t have an account?</p>
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
							src="images/recraftlogo2.webp"
							width="1024"
							height="1024"
							alt="Dash Tasker"
							className="image-hero"
							loading="eager"
							fetchpriority="high"
							decoding="async"
						/>
					</div>
				</div>
				<ErrorDisplay />
				<div>
					<Footer />
				</div>
			</div>
		</>
	);
};

export default Login;
