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
				canonical="https://dash-tasker-prod.web.app/"
				// Exmample of preloading responsive images
				// preloadResponsive={{
				// 	srcset:
				// 		"/images/DashTaskHero480-98.webp 480w, " +
				// 		"/images/DashTaskHero768-98.webp 768w, " +
				// 		"/images/DashTaskHero1280-99.webp 1280w",
				// 	sizes: "(max-width:480px) 100vw, (max-width:768px) 100vw, 1184px",
				// }}
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
							src="/images/DashTaskHero1184-99.webp"
							srcSet="/images/DashTaskHero480-98.webp 480w,
							  /images/DashTaskHero768-98.webp 768w,
							  /images/DashTaskHero960-99.webp 960w,          
          					/images/DashTaskHero1184-99.webp 1184w"
							sizes="(min-width: 901px) 45vw, 90vw"
							width="1184"
							height="864"
							alt="Dash Tasker Cycle Hero"
							className="image-hero"
							loading="eager"
							fetchpriority="high"
							decoding="async"
							style={{ maxWidth: "100%", height: "auto" }}
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
