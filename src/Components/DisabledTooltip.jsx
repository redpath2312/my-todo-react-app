// DisabledTooltip.jsx (or inline in the same file)
import Tooltip from "@mui/material/Tooltip";

export function DisabledTooltip({ title, children, placement = "bottom" }) {
	// If you don't want a tooltip when disabled, flip the *_Listener props here.
	return (
		<Tooltip
			title={title}
			placement={placement}
			disableHoverListener={false}
			disableFocusListener={false}
			disableTouchListener={false}
		>
			<span style={{ display: "inline-block" }}>
				{children /* must render the Button/IconButton here */}
			</span>
		</Tooltip>
	);
}
