import { Button } from "@mui/material";
export default function PrimaryButton({ children, ...props }) {
	return (
		<Button
			variant="contained"
			color="primary"
			sx={{
				my: 3,
			}}
			{...props}
		>
			{children}
		</Button>
	);
}
