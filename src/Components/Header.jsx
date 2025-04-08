import React, { useState } from "react";
import { useAuth } from "../AuthContext";

function Header() {
	const name = "Pete";
	const { user, userState, handleLogOut } = useAuth();

	const handleLogOutSubmit = async (e) => {
		e.preventDefault();
		try {
			console.log("Trying to Log Out");
			await handleLogOut();
		} catch (error) {
			console.log("Error logging out...", error.message);
		}
	};

	return (
		<header>
			<div className="header-logo">
				<img
					className="header-icon"
					src="/check-list-icon_128.svg"
					alt="List Logo"
				/>
			</div>

			<div>
				{userState === "guest" ? (
					<h1> Guest Mode </h1>
				) : (
					userState === "loggedIn" && <h1>Welcome {name}</h1>
				)}
			</div>
			<div className="header-logout">
				<a href="/Login">
					<button onClick={handleLogOutSubmit} className="logout-button">
						{userState === "guest"
							? "Home"
							: userState === "loggedIn" && "Log Out"}
					</button>
				</a>
			</div>
		</header>
	);
}

export default Header;
