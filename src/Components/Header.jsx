import React, { useState } from "react";

function Header({ userState }) {
	const name = "Pete";

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
					<button className="logout-button">
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
