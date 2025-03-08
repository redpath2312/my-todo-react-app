import React, { useState } from "react";

function Header({ isAuth, isGuest }) {
	// const [isAuthed, setIsAuthed] = useState(true);
	// const [isGuest, setIsGuest] = useState(false);

	const name = "Pete";

	console.log(`Auth is set to ${isAuth} in Header`);
	console.log(`Guest is set to ${isGuest} in Header`);
	return (
		<header>
			<div className="header-logo">
				<img
					className="header-icon"
					src="/check-list-icon_128.svg"
					alt="List Logo"
				/>
			</div>

			<div>{isGuest ? <h1> Guest Mode </h1> : <h1>Welcome {name}</h1>}</div>
			<div className="header-logout">
				<a href="/Login">
					<button className="logout-button">
						{isGuest ? "Home" : "Log Out"}
					</button>
				</a>
			</div>
		</header>
	);
}

export default Header;
