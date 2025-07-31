import React, { useState, useEffect } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CircularProgress from "@mui/material/CircularProgress";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { useUI } from "../UIContext";

function Card({
	id,
	text,
	done,
	highPriority,
	dashTask,
	onDelete,
	onTextUpdate,
	onSelect,
	onFlagToggle,
}) {
	const { editingLockRef, setIsEditingLock } = useUI();
	const [isHovered, setHovered] = useState(false);
	const [cardText, setCardText] = useState(text);
	const [isEditing, setEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [debounceTimeout, setDebounceTimeout] = useState(null);

	const flagProps = { done, highPriority };

	function handleTextChange(event) {
		handleEditing();
		setCardText(event.target.value);
	}

	function handleEditing() {
		if (!isEditing) {
			setEditing(true);
			editingLockRef.current = true;
			setIsEditingLock(true);
			console.log("Now editing");
		}
	}

	async function handleSaveCardUpdate(newText) {
		try {
			setIsSaving(true);
			await onTextUpdate(id, newText, flagProps);
			console.log("Saved");
		} catch (error) {
			console.log("Error saving", error);
		} finally {
			editingLockRef.current = false;
			setIsEditingLock(false);
			setIsSaving(false);
			setEditing(false);
			console.log("Finished saving and editing");
		}
	}

	function handleMouseEnter() {
		setHovered(true);
	}

	function handleMouseLeave() {
		setHovered(false);
		if (!isEditing || cardText === text) return;
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
			setDebounceTimeout(null);
		}
		setEditing(false);
		handleSaveCardUpdate(cardText);
	}

	useEffect(() => {
		if (cardText === text) return;
		if (debounceTimeout) clearTimeout(debounceTimeout);

		const timeout = setTimeout(() => {
			handleSaveCardUpdate(cardText);
		}, 2000);
		setDebounceTimeout(timeout);

		return () => clearTimeout(debounceTimeout);
	}, [cardText]);

	const handleFlagClick = (flagName, currentValue) => {
		if (editingLockRef.current || isEditing) {
			console.log("Blocked due to editing/saving lock");
			return;
		}
		onFlagToggle(id, flagName, currentValue, cardText);
	};

	const handleDeleteClick = (id) => {
		if (editingLockRef.current || isEditing) {
			console.log("Blocked due to editing/saving lock");
			return;
		}
		onDelete(id);
	};

	// let theme = createTheme({
	// 	palette: {
	// 		primary: { main: "#bdac80" },
	// 		secondary: { main: "#E98074" },
	// 	},
	// });

	function cardClassCheck(done, highPriority, isHovered, dashTask) {
		if (isHovered) return "card card-hovered";
		if (done) return "card card-done";
		if (highPriority) return "card card-high-priority";
		if (dashTask) return "card card-dash";
		return "card";
	}

	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={`${cardClassCheck(done, highPriority, isHovered, dashTask)} ${
				isEditing ? "is-editing" : ""
			}`}
		>
			<div className="cards-top">
				<div id="card-id-display">
					<p style={{ textAlign: "left" }}>id: {id}</p>
				</div>
				{isEditing && (
					<div className="card-spinner-wrapper">
						<CircularProgress size={16} />
					</div>
				)}
			</div>
			<div className="cards-middle">
				{isSaving ? (
					<CircularProgress size={24} />
				) : (
					<form>
						<textarea
							maxLength={40}
							value={cardText}
							onInput={handleTextChange}
							id="card-text"
							onClick={() => onSelect(id)}
						/>
					</form>
				)}
			</div>

			<div className="cards-bottom">
				{/* <ThemeProvider theme={theme}> */}
				<div>
					<Tooltip title="Delete" placement="bottom">
						<IconButton
							disabled={editingLockRef.current}
							onClick={() => handleDeleteClick(id)}
						>
							<DeleteForeverIcon color="delete" />
						</IconButton>
					</Tooltip>
				</div>
				<div>
					<Tooltip title="Toggle High Priority" placement="bottom">
						<IconButton
							disabled={editingLockRef.current}
							onClick={() => handleFlagClick("highPriority", highPriority)}
						>
							<PriorityHighIcon
								value={highPriority}
								color={highPriority ? "urgent" : "disabled"}
							/>
						</IconButton>
					</Tooltip>
				</div>

				<div>
					<Tooltip title="Toggle Dash Task" placement="bottom">
						<IconButton
							disabled={editingLockRef.current}
							onClick={() => handleFlagClick("dashTask", dashTask)}
						>
							<ElectricBoltIcon
								value={dashTask}
								color={dashTask ? "dash" : "disabled"}
							/>
						</IconButton>
					</Tooltip>
				</div>

				<div>
					<Tooltip title="Toggle Done" placement="bottom">
						<IconButton
							disabled={editingLockRef.current}
							onClick={() => handleFlagClick("done", done)}
						>
							<CheckCircleIcon
								value={done}
								color={done ? "success" : "disabled"}
							/>
						</IconButton>
					</Tooltip>
				</div>
				{/* </ThemeProvider> */}
			</div>
		</div>
	);
}

export default Card;
