import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./Main";
import Login from "./Login";
import App from "./App";

const root = createRoot(document.getElementById("root"));
//Change between Login and Main
root.render(<Main />);
