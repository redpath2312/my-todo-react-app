import { createTheme } from "@mui/material";
import { getDesignTokens } from "./getDesignTokens";

export const createAppTheme = (mode) =>
	createTheme(getDesignTokens(mode), {
		components: {
			MuiIconButton: {
				styleOverrides: {
					root: {
						"&.Mui-disabled": {
							opacity: 0.4,
							// optionally keep the same color rather than MUI's grey:
							color: (t) => t.palette.text.primary,
							cursor: "not-allowed",
						},
					},
				},
			},
			MuiButton: {
				defaultProps: {
					disableRipple: true, // removes grey ripple/overlay
					disableElevation: true,
					fullWidth: true,
				},
				styleOverrides: {
					root: {
						textTransform: "none",
						borderRadius: "0.5rem",
						fontWeight: 500,
						backgroundImage: "none",
						transition:
							"transform 120ms ease, filter 150ms ease, box-shadow 150ms ease",
						"&:hover": { filter: "brightness(.97)" },
						"&:active": { transform: "translateY(1px)" },
						"&.Mui-focusVisible": {
							outline: "3px solid rgba(90,70,214,.45)", // tweak to your brand
							outlineOffset: 2,
						},
						"&.Mui-disabled": { opacity: 0.6, cursor: "not-allowed" },
					},
					sizeLarge: { height: 50, fontSize: "1.12rem", fontWeight: 600 },
					sizeMedium: { height: 40, fontSize: "1rem", fontWeight: 600 },
					sizeSmall: { height: 30, fontSize: ".9rem", fontWeight: 600 },
					containedPrimary: {
						backgroundImage: "none", // keep flat fill (no hover stripe)
					},
				},
			},
		},
	});
