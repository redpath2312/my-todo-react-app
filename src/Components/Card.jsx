import { useState, useEffect, useRef, useCallback } from "react";
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
import { log, info, warn, error as logError, trace } from "../utils/logger";

function Card({
	id,
	text,
	done,
	highPriority,
	dashTask,
	onDelete,
	onTextUpdate,
	onFlagToggle,
	createdAt,
}) {
	const { editingLockRef, lockEditing, unlockEditing } = useUI();
	const [cardText, setCardText] = useState(text);
	const [isEditing, setEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const saveGateRef = useRef(false);
	const isSavingRef = useRef(false);
	const debounceRef = useRef();
	const flagBusyRef = useRef(false);
	const isDeletingRef = useRef(false);
	const lastSavedRef = useRef({
		text: (text ?? "").trim(),
		done,
		highPriority,
		dashTask,
	});
	const flagCooldownRef = useRef(0);
	const FLAG_WINDOW_MS = 700;
	const createdDate = toJSDate(createdAt); // Optional if you want the tooltip date
	const ageLabel = createdDate ? formatAgeSince(createdDate) : ""; // This will re-render on an interval

	const onStartEdit = () => {
		setEditing(true);
		lockEditing(); // turn on global lock
	};
	// const flagProps = { done, highPriority };
	// const onEndEdit = () => {
	// 	setEditing(false);
	// 	unlockEditing(); // turn off global lock
	// };

	const handleSaveCardUpdate = useCallback(
		async (newText) => {
			const next = {
				text: (newText ?? "").trim(),
				done,
				highPriority,
				dashTask,
			};
			trace("card:save:start", { id, newText });
			// guards
			// if (!next.text) return;
			if (isSavingRef.current) return;

			const prev = lastSavedRef.current;
			const unchanged =
				next.text === prev.text &&
				next.done === prev.done &&
				next.highPriority === prev.highPriority &&
				next.dashTask === prev.dashTask;
			if (unchanged) return;

			try {
				isSavingRef.current = true;
				setIsSaving(true);
				await onTextUpdate(id, newText, {
					done: next.done,
					highPriority: next.highPriority,
					dashTask: next.dashTask,
				});
				// update AFTER success
				lastSavedRef.current = next;
				info("card:save:ok", { id });
			} catch (err) {
				logError("Error saving", err);
			} finally {
				isSavingRef.current = false;
				setIsSaving(false);

				//inline OnEndEdit logic so not depending on external function
				setEditing(false);
				unlockEditing(); // turn off global lock
				log("card:save:end", { id });
			}
		},
		[id, onTextUpdate, done, highPriority, dashTask, setEditing, unlockEditing]
	);

	const fireSaveOnce = useCallback(
		(nextText, source) => {
			if (saveGateRef.current) return; //already queued/inflight
			saveGateRef.current = true;
			trace("card:queued", { id, source });
			handleSaveCardUpdate(nextText).finally(() => {
				saveGateRef.current = false;
			});
		},
		[id, handleSaveCardUpdate]
	);

	function handleTextChange(event) {
		handleEditing();
		setCardText(event.target.value);
	}

	function handleEditing() {
		if (!isEditing) {
			onStartEdit();
		}
	}

	function handleMouseLeave() {
		if (!isEditing) return;

		// snapshot the prior state, then cancel once
		const hadDebounce = !!debounceRef.current;
		if (hadDebounce) {
			warn(`[card ${id}] mouseleave: clear debounce`);
			clearTimeout(debounceRef.current);
			debounceRef.current = null;
		}

		// Compare what you actually persist (text + flags)
		const fromDb = {
			text: (text ?? "").trim(),
			done,
			highPriority,
			dashTask,
		};
		const next = {
			text: (cardText ?? "").trim(),
			done,
			highPriority,
			dashTask,
		};

		const unchanged =
			next.text === fromDb.text &&
			next.done === fromDb.done &&
			next.highPriority === fromDb.highPriority &&
			next.dashTask === fromDb.dashTask;

		warn(
			`card ${id} mouseleave: haddebounce= ${hadDebounce}, unchanged= ${unchanged}`
		);

		if (!unchanged) {
			// save path → saver’s finally will unlock
			warn(`[card ${id}] mouseleave: save now`);
			fireSaveOnce(next.text, "handleMouseLeave");
		} else {
			// no change → unlock immediately (nice UX)
			warn(`[card ${id}] mouseleave: no change → unlock`);
			setEditing(false);
			unlockEditing();
		}
	}

	// Debounce only while editing- schedules the save when the edited value differs.
	useEffect(() => {
		if (!isEditing) return;
		if (debounceRef.current) {
			clearTimeout(debounceRef.current); //Always cancel any previous timer first, so hasPendingDebounce is accurate and we never fire stale saves.
			debounceRef.current = null;
		}

		const fromDb = {
			text: (text ?? "").trim(),
			done,
			highPriority,
			dashTask,
		};
		const next = {
			text: (cardText ?? "").trim(),
			done,
			highPriority,
			dashTask,
		};

		//guards
		// if (!next.text) return;
		if (isSavingRef.current) return;

		const unchangedToDb =
			next.text === fromDb.text &&
			next.done === fromDb.done &&
			next.highPriority === fromDb.highPriority &&
			next.dashTask === fromDb.dashTask;

		const unchangedToLast =
			next.text === lastSavedRef.current.text &&
			next.done === lastSavedRef.current.done &&
			next.highPriority === lastSavedRef.current.highPriority &&
			next.dashTask === lastSavedRef.current.dashTask;
		// If no change, don't re-arm a timer
		if (unchangedToLast || unchangedToDb) {
			setEditing(false);
			unlockEditing(); // <-- enable if you want instant unlock-on-revert
			return;
		}

		debounceRef.current = window.setTimeout(() => {
			fireSaveOnce(next.text, "debounce Save");
		}, 350); // you can keep 300–350ms safely with these guards

		//Clean up if deps change again before the timer fires
		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
				debounceRef.current = null;
			}
		};
	}, [
		isEditing,
		cardText,
		text,
		done,
		highPriority,
		dashTask,
		handleSaveCardUpdate,
		fireSaveOnce,
		setEditing,
		unlockEditing,
	]);
	// Safety-unlock effect guard to unlock isEditing - a backup timer that turns editing off if nothing is pending.
	useEffect(() => {
		if (!isEditing) return;
		const hasPendingDebounce = () => Boolean(debounceRef.current);
		const hasUnsavedChange = () => {
			const fromDb = {
				text: (text ?? "").trim(),
				done,
				highPriority,
				dashTask,
			};
			const next = {
				text: (cardText ?? "").trim(),
				done,
				highPriority,
				dashTask,
			};

			const differsFromDb =
				next.text !== fromDb.text ||
				next.done !== fromDb.done ||
				next.highPriority !== fromDb.highPriority ||
				next.dashTask !== fromDb.dashTask;

			const differsFromLast =
				next.text !== lastSavedRef.current.text ||
				next.done !== lastSavedRef.current.done ||
				next.highPriority !== lastSavedRef.current.highPriority ||
				next.dashTask !== lastSavedRef.current.dashTask;
			return differsFromDb && differsFromLast;
		};
		const editingIdleTimer = setTimeout(() => {
			warn("idle:check", {
				saving: isSavingRef.current,
				hasDebounce: !!debounceRef.current,
				hasUnsaved: hasUnsavedChange(),
			});
			if (
				!isSavingRef.current &&
				!hasPendingDebounce() &&
				!hasUnsavedChange()
			) {
				warn("idle:unlock");
				setEditing(false);
				unlockEditing();
			}
		}, 1500);
		return () => clearTimeout(editingIdleTimer);
	}, [isEditing, cardText, text, done, highPriority, dashTask, unlockEditing]);

	useEffect(() => {
		lastSavedRef.current = {
			text: (text ?? "").trim(),
			done,
			highPriority,
			dashTask,
		};
	}, [text, done, highPriority, dashTask]);

	const handleFlagClick = async (flagName, currentFlagValue) => {
		// block while editing text or another write is in-flight
		if (editingLockRef.current || isEditing) {
			warn("Blocked due to editing/saving lock");
			return;
		}

		// time-based burst lock (synchronous)
		const now = performance.now();

		if (now - flagCooldownRef < FLAG_WINDOW_MS) return;
		flagCooldownRef.current = now;

		// don't start a second write until the first has finished
		if (flagBusyRef.current) return;
		flagBusyRef.current = true;
		try {
			await onFlagToggle(id, flagName, currentFlagValue, cardText);
		} finally {
			flagBusyRef.current = false;
		}
	};

	const handleDeleteClick = async (id) => {
		if (editingLockRef.current || isEditing || isDeletingRef.current) {
			warn("Blocked due to editing/saving lock");
			return;
		}
		isDeletingRef.current = true;
		clearTimeout(debounceRef.current); // cancel pending save
		try {
			await onDelete(id);
		} finally {
			isDeletingRef.current = false;
		}
	};

	function cardClassCheck(done, highPriority, dashTask) {
		const classes = ["card"];
		if (done) classes.push("card-done");
		else if (highPriority) classes.push("card-high-priority");
		else if (dashTask) classes.push("card-dash");
		return classes.join(" ");
	}

	return (
		<div
			onMouseLeave={handleMouseLeave}
			className={`${cardClassCheck(done, highPriority, dashTask)} ${
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
							onBlur={handleMouseLeave}
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
