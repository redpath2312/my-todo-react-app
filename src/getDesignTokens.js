export const getDesignTokens = (mode) => ({
	palette: {
		mode,
		primary: {
			main: "#5c43e9", // Blue-Purple for login and nav
		},
		secondary: {
			main: "#1976d2", //Blue for action buttons
		},
		urgent: {
			main: "#E98074", // Red/Orange for high priority
		},
		dash: {
			main: "#F9C74F", // Gold for Dash Tasks
		},
		success: {
			main: "#0d7016", // Green for Done
		},
		delete: {
			main: "#4B4B4B", // Dark Grey for Delete
		},
		disabled: {
			main: "#BDBDBD", //Light Grey for Disabled/Off
		},
		...(mode === "light"
			? {
					background: {
						default: "#fdf6e3", // Light beige
						paper: "#fffdf7", // Lighter beige for cards
						beige: "#c7a67b",
						lightGrey: "#f5f5f5",
						darkGrey: "#4B4B4B",
					},
					text: {
						primary: "#333333",
						secondary: "#666666",
					},
			  }
			: {
					background: {
						default: "#121212",
						paper: "#1E1E1E",
						beige: "#333333",
						lightGrey: "#1A1A1A",
						darkGrey: "#999999",
					},
					text: {
						primary: "#E0E0E0",
						secondary: "#A0A0A0",
					},
			  }),
	},
});
