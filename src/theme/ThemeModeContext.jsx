import { createContext, useContext, useMemo, useEffect, useState } from "react";
// import { ThemeProvider } from "@mui/material/styles";
import { ThemeProvider, CssBaseline, GlobalStyles } from "@mui/material";
import { createAppTheme } from "./theme"; // <-- your existing theme.js

// 1. Create a Context object so we can share theme mode state (light/dark)
//    across the entire app without prop drilling.
const ThemeModeContext = createContext(null);
const KEY = "app-color-mode";
function readInitialMode() {
	try {
		const saved = localStorage.getItem(KEY);
		if (saved === "light" || saved === "dark") return saved; // authoritative
	} catch {}
	// only if nothing saved, use system
	const prefersDark =
		typeof window !== "undefined" &&
		window.matchMedia?.("(prefers-color-scheme: dark)").matches;
	return prefersDark ? "dark" : "light";
}

// 2. Provider component that wraps your app.
//    This is what replaces the hardcoded ThemeProvider in main.jsx.
export function ThemeModeProvider({ children }) {
	const [mode, setMode] = useState(readInitialMode);

	// On mount, *re-assert* saved value if it exists (protects against other code defaulting to light)
	useEffect(() => {
		try {
			const saved = localStorage.getItem(KEY);
			if (saved === "light" || saved === "dark") {
				if (saved !== mode) setMode(saved);
			}
		} catch {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Persist + expose for CSS selectors/vars
	useEffect(() => {
		localStorage.setItem(KEY, mode);
		document.documentElement.dataset.theme = mode;
	}, [mode]);

	// Generate a fresh MUI theme object every time mode changes.
	// This ensures your components automatically re-style themselves.
	const theme = useMemo(() => createAppTheme(mode), [mode]);

	// Bundle together the values/functions we want to share via context.
	// - `mode`: current mode string
	// - `setMode`: function to set a specific mode
	// - `toggle`: convenience function to flip between light/dark
	const value = useMemo(
		() => ({
			mode,
			setMode,
			toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
		}),
		[mode]
	);

	// Render:
	// - Provide the context value to all children
	// - Wrap children in MUI's ThemeProvider, using our generated theme
	return (
		<ThemeModeContext.Provider value={value}>
			<ThemeProvider theme={theme}>
				<CssBaseline />{" "}
				<GlobalStyles
					styles={(t) => ({
						":root": {
							// Surfaces
							"--bg-default": t.palette.background.default,
							"--bg-section": t.palette.background.section,
							"--bg-container": t.palette.background.container,
							"--bg-inner": t.palette.background.inner,
							"--bg-paper": t.palette.background.paper,
							"--bg-hovered": t.palette.background.hovered,

							// Text
							"--text-primary": t.palette.text.primary,
							"--text-secondary": t.palette.text.secondary,

							// Brand & semantics (from your palette)
							"--primary-main": t.palette.primary.main,
							"--secondary-main": t.palette.secondary.main,
							"--urgent-main": t.palette.urgent.main,
							"--dash-main": t.palette.dash.main,
							"--success-main": t.palette.success.main,
							"--delete-main": t.palette.delete.main,
							"--disabled-main": t.palette.disabled.main,

							// Lane backgrounds: tinted in light, calm in dark
							"--lane-hp-bg":
								t.palette.mode === "dark"
									? t.palette.background.container
									: t.palette.urgent.main,
							"--lane-dash-bg":
								t.palette.mode === "dark"
									? t.palette.background.container
									: t.palette.dash.main,
							"--lane-all-bg":
								t.palette.mode === "dark"
									? t.palette.background.container
									: t.palette.secondary.main,
							"--lane-done-bg":
								t.palette.mode === "dark"
									? t.palette.background.container
									: t.palette.success.main,
							"--lane-on":
								t.palette.mode === "dark" ? t.palette.text.primary : "#ffffff",
						},
					})}
				/>
				{children}
			</ThemeProvider>
		</ThemeModeContext.Provider>
	);
}

// 3. Custom hook so any component can easily use theme mode state.
//    Example usage:
//      const { mode, toggle } = useThemeMode();
export function useThemeMode() {
	return useContext(ThemeModeContext);
}
