import { Button } from "@mui/material";
export default function PrimaryButton({ children, ...props }) {
	return (
		<Button
			variant="contained"
			color="primary"
			sx={{
				textTransform: `none`,
				width: `100%`,
				height: `50px`,
				fontWeight: 500,
				borderRadius: `0.5rem`,
				fontSize: `1.12rem`,
				my: 3,
			}}
			{...props}
		>
			{children}
		</Button>
	);
}
