import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import HeaderButton from "./Buttons/HeaderButton";
function Header() {
	const { user, userState, handleLogOut } = useAuth();
	const navigate = useNavigate();

	// Setting name if logged in and user exists to be the user's display name, but if no display name is provided then use "User". If conditions not met then user info will be blank "".

	const name =
		userState === "loggedIn" && user ? user.displayName || "User" : "";
	const handleLogOutSubmit = async (e) => {
		e.preventDefault();
		try {
			console.log("Trying to Log Out");
			await handleLogOut();
			navigate("/Login");
		} catch (error) {
			console.log("Error logging out...", error.message);
		}
	};

	return (
		<header>
			<div className="header-logo">
				<img
					className="header-icon"
					src="images/check-list-icon_128.svg"
					alt="List Logo"
				/>
			</div>

			<div>
				{userState === "guest" ? (
					<h1 className="page-title"> Guest Mode </h1>
				) : (
					userState === "loggedIn" && (
						<h1 className="page-title">Welcome {name}</h1>
					)
				)}
			</div>
			<div className="header-logout">
				<HeaderButton onClick={handleLogOutSubmit} className="logout-button">
					{userState === "guest"
						? "Home"
						: userState === "loggedIn" && "Log Out"}
				</HeaderButton>
			</div>
		</header>
	);
}

export default Header;
