import { useState } from "react";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { useUI } from "../UIContext";

function DraftCard(props) {
	const [createCardText, setCreateCardText] = useState("");
	const [highPriorityDraft, setHighPriorityDraft] = useState(false);
	const [dashTaskDraft, setdashTaskDraft] = useState(false);

	const { editingLocked } = useUI();
	const lockedByOthers = editingLocked; // Draft never owns the lock

	const [isHovered, setHovered] = useState(false);

	function handleChange(event) {
		setCreateCardText(event.target.value);
	}

	function handleMouseEnter() {
		setHovered(true);
	}

	function handleMouseLeave() {
		setHovered(false);
	}

	function handleFlagClick(flag) {
		if (flag === "high-priority") {
			setHighPriorityDraft(!highPriorityDraft);
		} else if (flag === "dash-task") {
			setdashTaskDraft(!dashTaskDraft);
		} else return;
	}

	async function handleSubmit(event) {
		event.preventDefault();
		await props.onAdd(createCardText, highPriorityDraft, dashTaskDraft);
		setCreateCardText("");
		setHighPriorityDraft(false);
		setdashTaskDraft(false);
	}

	return (
		<div
			className="panel-inner panel--draft"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			<h2 className="h2-heading">Create</h2>
			<form onSubmit={handleSubmit}>
				<div
					id="draft-card"
					className={isHovered ? "card card-hovered" : "card"}
				>
					<div className="cards-top"></div>
					<div>
						<textarea
							maxLength={40}
							onChange={handleChange}
							name="cardtext"
							rows="2"
							cols="30"
							placeholder="Add new task here"
							value={createCardText}
							readOnly={lockedByOthers} // locked only when others are editing
							aria-readonly={lockedByOthers}
						></textarea>
					</div>
					<div className="draft-card-bottom">
						<div>
							<Tooltip title="Toggle High Priority" placement="bottom">
								<IconButton onClick={() => handleFlagClick("high-priority")}>
									<PriorityHighIcon
										value={highPriorityDraft}
										fontSize="medium"
										color={highPriorityDraft ? "urgent" : "disabled"}
									/>
								</IconButton>
							</Tooltip>
						</div>
						<div>
							<Tooltip title="Toggle Dash Task" placement="bottom">
								<IconButton onClick={() => handleFlagClick("dash-task")}>
									<ElectricBoltIcon
										value={dashTaskDraft}
										fontSize="medium"
										color={dashTaskDraft ? "dash" : "disabled"}
									/>
								</IconButton>
							</Tooltip>
						</div>
						<div>
							<Tooltip title="Add task" placement="bottom">
								{/* disabled={props.isAdding} , but pack in icon button directly below when not testing the spam add */}
								<IconButton
									disabled={props.isAdding || editingLocked}
									type="submit"
								>
									{props.isAdding ? (
										<CircularProgress size={24} />
									) : (
										<NoteAddIcon color="secondary" />
									)}
								</IconButton>
							</Tooltip>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}

export default DraftCard;
