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
import { formatAgeSince, toJSDate } from "../utils/timeElapsed";

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
	createdAt,
}) {
	const { editingLockRef, lockEditing, unlockEditing } = useUI();
	const [isHovered, setHovered] = useState(false);
	const [cardText, setCardText] = useState(text);
	const [isEditing, setEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [debounceTimeout, setDebounceTimeout] = useState(null);

	const flagProps = { done, highPriority };

	const createdDate = toJSDate(createdAt); // Optional if you want the tooltip date
	const ageLabel = createdDate ? formatAgeSince(createdDate) : ""; // This will re-render on an interval

	const onStartEdit = () => {
		setEditing(true);
		lockEditing(); // turn on global lock
	};
	const onEndEdit = () => {
		setEditing(false);
		unlockEditing(); // turn off global lock
	};

	function handleTextChange(event) {
		handleEditing();
		setCardText(event.target.value);
	}

	function handleEditing() {
		if (!isEditing) {
			onStartEdit();
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
			setIsSaving(false);
			onEndEdit();
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

	function cardClassCheck(done, highPriority, isHovered, dashTask) {
		const classes = ["card"];
		if (done) classes.push("card-done");
		else if (highPriority) classes.push("card-high-priority");
		else if (dashTask) classes.push("card-dash");
		if (isHovered) classes.push("card-hovered");
		return classes.join(" ");
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
				<span>id: {id}</span>

				{isEditing && (
					<div className="card-spinner-wrapper">
						<CircularProgress size={16} />
					</div>
				)}
				<span title={createdDate ? createdDate.toLocaleString() : ""}>
					{ageLabel}
				</span>
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
							// onFocus={onStartEdit}
							onBlur={onEndEdit}
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
			</div>
		</div>
	);
}

export default Card;
