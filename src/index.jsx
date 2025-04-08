import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "./Main";
import { AuthProvider } from "./AuthContext";

const root = createRoot(document.getElementById("root"));
//Change between Login and Main
root.render(
	<Router>
		<AuthProvider>
			<Main />
		</AuthProvider>
	</Router>
);
