import React, { useState, useEffect } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CircularProgress from "@mui/material/CircularProgress";

// Card always in text area format
// Initial use state shows card text with values from props
// When card is selected and user starts typing it will then begin editing mode.
// Text area just displays local card text from user input
// When user stops hovering over the card, it will save automatically putting the new values into the db.

function Card({
	id,
	text,
	checked,
	highPriority,
	onCheckedChange,
	onPriorityChange,
	onDelete,
	onTextUpdate,
	onSelect,
}) {
	const [isHovered, setHovered] = useState(false);
	const [cardText, setCardText] = useState(text);
	const [isEditing, setEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [debounceTimeout, setDebounceTimeout] = useState(null);

	// Sync cardText with props when props.text changes (only if not editing)

	function handleTextChange(event) {
		handleEditing();
		const newText = event.target.value;
		setCardText(newText);
	}

	function handleEditing() {
		if (!isEditing) {
			setEditing(true);
			console.log("Now editing");
		}
	}

	async function handleSaveCardUpdate(newText) {
		// Useful console logs to debug saving issues and state change by forcing a delay
		// console.log("Before Saving", isSaving);
		// setIsSaving(true);
		// console.log("After setting isSaving", isSaving);
		// // setTimeout(async () => {
		// // 	console.log("After a 2 sec delay");
		try {
			await onTextUpdate(newText);
			console.log("Saved");
		} catch (error) {
			console.log("error saving", error);
		} finally {
			setIsSaving(false);
			setEditing(false);
		}
		// }, 500);
	}

	function handleMouseEnter() {
		setHovered(true);
	}

	function handleMouseLeave() {
		setHovered(false);
		// Prevent duplicate save if no actual edit was made
		if (!isEditing || cardText === text) return;

		// Clear the pending debounce function
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
			setDebounceTimeout(null);
		}

		// Save immediately when leaving
		setEditing(false);
		handleSaveCardUpdate(cardText);
	}

	let theme = createTheme({
		palette: {
			primary: {
				main: "#bdac80",
			},
			secondary: {
				main: "#E98074",
			},
		},
	});

	function cardClassCheck(checked, highPriority, isHovered) {
		if (isHovered) return "card card-hovered"; // Yellow for hovered cards
		else if (checked) return "card card-done"; // Green for done cards
		else if (highPriority)
			return "card card-high-priority"; // Red for high-priority cards
		else return "card"; // Blue for other tasks
	}

	useEffect(() => {
		if (cardText === text) return;

		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		// Only debounce if user is typing (not hovering out)
		// if (isHovered) {
		const timeout = setTimeout(() => {
			handleSaveCardUpdate(cardText);
		}, 5000); // 5-second delay
		setDebounceTimeout(timeout);

		// Cleanup timeout on unmount or new input
		return () => clearTimeout(debounceTimeout);
	}, [cardText]); // Runs every time `cardText` changes

	return (
		<div
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			className={cardClassCheck(checked, highPriority, isHovered)}
		>
			<div className="cards-top">
				<div id="card-id-display">
					<p style={{ textAlign: "left" }}>id: {id}</p>
				</div>
			</div>
			<div className="cards-middle">
				{isSaving ? (
					<CircularProgress size={24} />
				) : (
					<form>
						<textarea
							maxLength={30}
							value={cardText}
							onInput={handleTextChange}
							id="card-text"
							onClick={() => {
								onSelect(id);
							}}
						/>
					</form>
				)}
			</div>

			<div className="cards-bottom">
				<ThemeProvider theme={theme}>
					<div>
						<Tooltip title="Delete" placement="right">
							<IconButton
								onClick={() => {
									onDelete(id);
								}}
							>
								<DeleteForeverIcon fontSize="large" color="secondary" />
							</IconButton>
						</Tooltip>
					</div>
					<div>
						{" "}
						<Tooltip title="Toggle High Priority" placement="bottom">
							<IconButton
								onClick={() => {
									onPriorityChange(id);
								}}
							>
								<PriorityHighIcon
									value={highPriority}
									fontSize="large"
									color={`${highPriority ? "secondary" : "disabled"}`}
								/>
							</IconButton>
						</Tooltip>
					</div>
					<div>
						{" "}
						<Tooltip title="Toggle Done" placement="left-start">
							<IconButton
								onClick={() => {
									onCheckedChange(id);
								}}
							>
								<CheckCircleIcon
									value={checked}
									color={`${checked ? "success" : "disabled"}`}
									fontSize={`${checked ? "large" : "medium"}`}
								/>
							</IconButton>
						</Tooltip>
					</div>
				</ThemeProvider>
			</div>
		</div>
	);
}

export default Card;
