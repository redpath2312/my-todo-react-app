import Footer from "./Components/Footer";

import { Link } from "react-router-dom";
import ForgotPwdForm from "./Components/ForgotPwdForm";
import ErrorDisplay from "./Components/ErrorDisplay";
import AppMeta from "./Components/AppMeta";

const ForgotPwd = () => {
	return (
		<>
			<AppMeta
				baseTitle="DashTasker - Forgot Password"
				baseDescription="Reset your DashTasker password to get back to managing your tasks"
			/>
			<div className="forgotpwd-page-full">
				<div className="forgotpwd-section">
					<div className="forgotpwd-container">
						<h2 className="form-title">Forgot Password</h2>
						<ForgotPwdForm />
						<hr className="or-divider"></hr>
						<div className="back-to-home"></div>
						<div className="small-text">
							<p>Want to go back?</p>
							<Link to="/login">Back to Login</Link>
						</div>
					</div>
					<div className="forgotpwd-image">
						<img
							src="/images/DashTaskPNGHeroLarge.webp"
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
export default ForgotPwd;
