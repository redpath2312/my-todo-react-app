import "./styles.css";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import Main from "./main";
import { AuthProvider } from "./AuthContext";
import { ErrorProvider } from "./ErrorContext";
import { UIProvider } from "./UIContext";

const root = createRoot(document.getElementById("root"));
//Change between Login and Main
root.render(
	<HelmetProvider>
		<UIProvider>
			<ErrorProvider>
				<Router>
					<AuthProvider>
						<Main />
					</AuthProvider>
				</Router>
			</ErrorProvider>
		</UIProvider>
	</HelmetProvider>
);
