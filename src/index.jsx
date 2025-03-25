import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./Main";
import { AuthProvider } from "./AuthContext";

const root = createRoot(document.getElementById("root"));
//Change between Login and Main
root.render(
	<AuthProvider>
		<Main />
	</AuthProvider>
);
