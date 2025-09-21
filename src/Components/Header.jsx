import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import HeaderButton from "./Buttons/HeaderButton";
import ThemeModeToggle from "./Buttons/ThemeModeToggle";

function Header() {
	const { user, userState, handleLogOut } = useAuth();
	const navigate = useNavigate();

	// Setting name if logged in and user exists to be the user's display name, but if no display name is provided then use "User". If conditions not met then user info will be blank "".

	const name =
		userState === "loggedIn" && user ? user.displayName || "User" : "";
	const handleLogOutSubmit = async (e) => {
		e.preventDefault();
		try {
			await handleLogOut();
			navigate("/Login");
		} catch (error) {
			console.error("Error logging out...", error.message);
		}
	};

	return (
		<header className="header section">
			<div className="container header-grid">
				<div className="header-left">
					<ThemeModeToggle />
				</div>

				<div className="header-title">
					{userState === "guest" ? (
						<h1 className="page-title muted"> Guest Mode </h1>
					) : (
						userState === "loggedIn" && (
							<h1 className="page-title muted">Welcome {name}</h1>
						)
					)}
				</div>

				<div className="header-right">
					<HeaderButton onClick={handleLogOutSubmit} className="logout-button">
						{userState === "guest"
							? "Home"
							: userState === "loggedIn" && "Log Out"}
					</HeaderButton>
				</div>
			</div>
		</header>
	);
}

export default Header;
