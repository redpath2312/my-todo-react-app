import React, { useState, useEffect } from "react";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { useUI } from "../UIContext";

function DraftCard(props) {
	const [createCardText, setCreateCardText] = useState("");
	const [highPriorityDraft, setHighPriorityDraft] = useState(false);
	const [dashTaskDraft, setdashTaskDraft] = useState(false);
	const { isInteractionLocked, setIsInteractionLocked } = useUI();
	useEffect(() => {
		console.log("DraftCard re-rendered with lock:", isInteractionLocked);
	}, [isInteractionLocked]);

	function handleChange(event) {
		setCreateCardText(event.target.value);
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

	let theme = createTheme({
		palette: {
			create: {
				main: "#c7a67b",
			},
		},
	});

	return (
		<form onSubmit={handleSubmit}>
			<div id="draft-card" className="card">
				<div className="cards-top"></div>
				<div>
					<textarea
						maxLength={30}
						onChange={handleChange}
						name="cardtext"
						rows="2"
						cols="30"
						placeholder="Write new task here"
						value={createCardText}
					></textarea>
				</div>
				<div className="draft-card-bottom">
					<ThemeProvider theme={theme}>
						<div>
							<Tooltip title="Toggle High Priority" placement="bottom">
								<IconButton
									// disabled={editingLockRef.current}
									onClick={() => handleFlagClick("high-priority")}
								>
									<PriorityHighIcon
										value={highPriorityDraft}
										fontSize="medium"
										color={highPriorityDraft ? "secondary" : "disabled"}
									/>
								</IconButton>
							</Tooltip>
						</div>
						<div>
							<Tooltip title="Toggle Dash Task" placement="bottom">
								<IconButton
									// disabled={editingLockRef.current}
									onClick={() => handleFlagClick("dash-task")}
								>
									<ElectricBoltIcon
										value={dashTaskDraft}
										fontSize="medium"
										color={dashTaskDraft ? "secondary" : "disabled"}
									/>
								</IconButton>
							</Tooltip>
						</div>
						<div>
							<Tooltip title="Add task" placement="bottom">
								{/* disabled={props.isAdding} , but pack in icon button directly below when not testing the spam add */}
								<IconButton
									disabled={props.isAdding || isInteractionLocked}
									type="submit"
								>
									{props.isAdding || isInteractionLocked ? (
										<CircularProgress size={24} />
									) : (
										<NoteAddIcon color="create" />
									)}
								</IconButton>
							</Tooltip>
						</div>
					</ThemeProvider>
				</div>
			</div>
		</form>
	);
}

export default DraftCard;
