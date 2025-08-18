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

		disabled: {
			main: "#BDBDBD", //Light Grey for Disabled/Off
		},
		...(mode === "light"
			? {
					background: {
						// 1–6 (lightest -> darkest-ish, but still “light”)
						default: "#FDF6E3", // 1 page
						section: "#faf5e6", // 2 header/footer/top band/swimlanes band
						container: "#f5eed9", // 3 widgets/panels outer
						inner: "#F7EED1", // 4 inner containers
						paper: "#f7f2e4", // 5 cards/surfaces
						hovered: "#FFFFFF", // 6 hover highlight (lightest)
					},
					text: { primary: "#333333", secondary: "#666666" },
					delete: {
						main: "#4B4B4B", // Dark Grey for Delete
					},
			  }
			: {
					background: {
						// dark staircase (darker -> lighter as we go down surfaces)
						default: "#121212", // page
						section: "#15171C", // bands (header/footer/top/swimlanes)
						container: "#171A20", // widgets/panels outer
						inner: "#1A1F26", // inner containers
						paper: "#1E1E1E", // cards
						hovered: "#262A33", // hover lift
					},
					text: { primary: "#E0E0E0", secondary: "#A0A0A0" },
					delete: {
						main: "#FFFFFF", // White for Delete
					},
			  }),
	},
});
