import { Button } from "@mui/material";

export default function HeaderButton({ children, ...props }) {
	return (
		<Button
			variant="contained"
			color="primary"
			sx={{
				textTransform: `none`,
				height: `30px`,
				fontSize: `0.9rem`,
				width: `100%`,
				fontWeight: 550,
				borderRadius: `0.5rem`,
				my: 1.5,
				// justifyContent: `center`,
			}}
			{...props}
		>
			{children}
		</Button>
	);
}
