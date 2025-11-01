import Footer from "./Components/Footer";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import SocialRegister from "./Components/SocialRegister";
import RegisterForm from "./Components/RegisterForm";
import ErrorDisplay from "./Components/ErrorDisplay";
import ThemeModeToggle from "./Components/Buttons/ThemeModeToggle";
import AppMeta from "./Components/AppMeta";

const Register = () => {
	const { handleGuestSignIn } = useAuth();

	const handleGuestClick = () => {
		handleGuestSignIn();
	};
	return (
		<>
			<AppMeta
				baseTitle="DashTasker - Register"
				baseDescription="Register for a DashTasker account to start creating and managing tasks."
			/>
			<div className="register-page-full">
				<div className="register-page">
					<div className="register-section">
						<div className="register-container">
							<div className="panel-toggle">
								<ThemeModeToggle />
							</div>
							<h2 className="form-title">Register with</h2>
							<SocialRegister />

							<hr className="or-divider"></hr>

							<RegisterForm />

							<hr className="or-divider"></hr>

							<div className="no-account-section">
								<div className="no-account-text small-text">
									<p> Changed your mind?</p>
									<Link to="/guest" onClick={handleGuestClick}>
										Try now as a guest
									</Link>
								</div>
								<div className="no-account-text small-text">
									<p> Already have account?</p>
									<Link to="/login">Back to Login</Link>
								</div>
							</div>
						</div>
					</div>

					<div className="image-background">
						<img
							src="/images/DashTaskPNGHeroLarge.webp"
							width="1184"
							height="864"
							alt="Dash Tasker Cycle Hero"
							className="image-hero"
							loading="eager"
							fetchPriority="high"
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

export default Register;
