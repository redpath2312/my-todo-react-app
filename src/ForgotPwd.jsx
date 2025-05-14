import Footer from "./Components/Footer";

import { Link } from "react-router-dom";
import ForgotPwdForm from "./Components/ForgotPwdForm";

const ForgotPwd = () => {
	return (
		<div className="forgotpwd-page-full">
			<div className="forgotpwd-page">
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
				</div>
			</div>
			<div>
				<Footer />
			</div>
		</div>
	);
};
export default ForgotPwd;
