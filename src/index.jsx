import React from "react";
import "./styles.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "./main";
import { AuthProvider } from "./AuthContext";
import { ErrorProvider } from "./ErrorContext";
import { UIProvider } from "./UIContext";
// import Register from "./Register";

const root = createRoot(document.getElementById("root"));
//Change between Login and Main
root.render(
	<UIProvider>
		<ErrorProvider>
			<AuthProvider>
				<Router>
					<Main />
				</Router>
			</AuthProvider>
		</ErrorProvider>
	</UIProvider>
);
