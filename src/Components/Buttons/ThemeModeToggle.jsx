import { IconButton, Tooltip } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "../../theme/ThemeModeContext";

export default function ThemeModeToggle() {
	const { mode, toggle } = useThemeMode();
	const isDark = mode === "dark";
	return (
		<Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"}>
			<IconButton
				onClick={toggle}
				aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
				size="small"
				aria-pressed={isDark}
			>
				{isDark ? (
					<LightModeIcon fontSize="large" color="dash" />
				) : (
					<DarkModeIcon fontSize="large" color="dash" />
				)}
			</IconButton>
		</Tooltip>
	);
}
