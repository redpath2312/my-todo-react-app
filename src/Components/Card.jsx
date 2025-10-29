import { useState, useEffect, useRef, useCallback } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import IconButton from "@mui/material/IconButton";
import { DisabledTooltip } from "./DisabledTooltip";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CircularProgress from "@mui/material/CircularProgress";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import { useUI } from "../UIContext";
import { formatAgeSince, toJSDate } from "../utils/timeElapsed";
import {
	log,
	info,
	error as logError,
	trace,
	devDebug,
	devWarn,
} from "../utils/logger";
import { useAlert } from "../ErrorContext";

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
	const isDeletingRef = useRef(false);
	const lastSavedRef = useRef({
		text: (text ?? "").trim(),
		done,
		highPriority,
		dashTask,
	});
	const flagCooldownRef = useRef({ highPriority: 0, dashTask: 0, done: 0 });
	const flagBusyRef = useRef({
		highPriority: false,
		dashTask: false,
		done: false,
	});

	// mirror in state so React re-renders when busy changes
	const [busyState, setBusyState] = useState({
		dashTask: false,
		highPriority: false,
		done: false,
	});
	const { addAlert } = useAlert();

	const FLAG_WINDOW_MS = 700; // for slow 4G.

	const createdDate = toJSDate(createdAt); // Optional if you want the tooltip date
	const ageLabel = createdDate ? formatAgeSince(createdDate) : ""; // This will re-render on an interval

	// --- helpers ---
	// inside your Card component
	const isLocked = editingLockRef.current || isEditing;

	function isActionDisabled(flagName) {
		return isLocked || isBusy(flagName);
	}

	// Has this flag been toggled too recently?
	function withinCooldown(flagName) {
		const last = flagCooldownRef.current[flagName] || 0;
		return performance.now() - last < FLAG_WINDOW_MS;
	}

	// Start a new cooldown window for a flag
	function armCooldown(flagName) {
		flagCooldownRef.current[flagName] = performance.now();
	}
	// Is a write currently in-flight for this flag?
	function isBusy(flagName) {
		return !!busyState[flagName];
	}
	// Mark a flag as busy / not busy
	function setBusy(flagName, nextBusy) {
		flagBusyRef.current[flagName] = nextBusy;
		// update state to trigger a re-render
		setBusyState((prev) => ({ ...prev, [flagName]: nextBusy }));
	}

	function onFlagPointerDown(e, flagName) {
		if (editingLockRef.current || isEditing) return;

		// Cancel any pending text autosave so the flag write doesn’t race it
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
			debounceRef.current = null;
			devDebug(`[card ${id}] ${flagName}: cancelled text debounce`);
		}

		// Hard-stop bursts before the click fires
		// If a write is already in flight

		if (isBusy(flagName)) {
			devWarn(`[card ${id}] ${flagName}: blocked (busy)`);
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		// If within cooldown window
		if (withinCooldown(flagName)) {
			devWarn(`[card ${id}] ${flagName}: blocked (cooldown)`);
			e.preventDefault();
			e.stopPropagation(); // stop this click from bubbling to any parent onClick
			return;
		}
		// Otherwise prearm for this burst
		armCooldown(flagName); // pre-arm
		devDebug(`[card ${id}] ${flagName}: pre-armed`);
	}

	const onStartEdit = () => {
		setEditing(true);
		lockEditing(); // turn on global lock
	};

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
				await onTextUpdate(
					id,
					newText
					// 	 {
					// 	done: next.done,
					// 	highPriority: next.highPriority,
					// 	dashTask: next.dashTask,
					// }
				);
				// update AFTER success
				lastSavedRef.current = next;
				info("card:save:ok", { id });
			} catch (err) {
				logError("Error saving", err);
				addAlert("Error saving", err)
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

		//  1) cancel any pending debounce to avoid racing
		const hadDebounce = !!debounceRef.current;
		if (hadDebounce) {
			devDebug(`[card ${id}] mouseleave: clear debounce`);
			clearTimeout(debounceRef.current);
			debounceRef.current = null;
		}

		// 2) if a save is already in flight, do nothing; saver’s finally will unlock
		if (isSavingRef.current) {
			devDebug(`[card ${id}] mouseleave: isSaving → defer unlock to saver`);
			return;
		}
		// 3) compare persisted vs local; we still consider flags here for safety
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

		devDebug(
			`card ${id} mouseleave: haddebounce= ${hadDebounce}, unchanged= ${unchanged}`
		);

		if (!unchanged) {
			// 4) changed → persist TEXT ONLY; saver’s finally will unlock
			devDebug(`[card ${id}] mouseleave: save now`);
			fireSaveOnce(next.text, "handleMouseLeave");
			return;
		}
		// 5) no change → unlock immediately (nice UX)
		devDebug(`[card ${id}] mouseleave: no change → unlock`);
		setEditing(false);
		unlockEditing();
	}

	const handleDeleteClick = async (id) => {
		if (editingLockRef.current || isEditing || isDeletingRef.current) {
			devWarn("Blocked due to editing/saving lock");
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

	async function handleFlagClick(flagName, currentFlagValue) {
		if (editingLockRef.current || isEditing) return;
		// Re-check for keyboard-triggered clicks
		if (isBusy(flagName)) return;

		armCooldown(flagName);
		setBusy(flagName, true);
		devDebug(`[card ${id}] ${flagName}: click → persist start`);
		try {
			// CRITICAL: onFlagToggle must return the Promise (Dashboard → Main → Service)
			await onFlagToggle(id, flagName, currentFlagValue);
			devDebug(`[card ${id}] ${flagName}: persist ok`);
		} finally {
			setBusy(flagName, false);
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
		}, 2000); // you can keep 300–350ms safely with these guards,- upped as was re-rendering too frequently and losing focus

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
			devDebug("idle:check", {
				saving: isSavingRef.current,
				hasDebounce: !!debounceRef.current,
				hasUnsaved: hasUnsavedChange(),
			});
			if (
				!isSavingRef.current &&
				!hasPendingDebounce() &&
				!hasUnsavedChange()
			) {
				devDebug("idle:unlock");
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

	return (
		<div
			onMouseLeave={handleMouseLeave}
			className={`${cardClassCheck(done, highPriority, dashTask)} ${
				isEditing ? "is-editing" : ""
			}`}
		>
			<div className="cards-top">
				<span>id: {id}</span>
				{/* 
				{isEditing && (
					<div className="card-spinner-wrapper">
						<CircularProgress size={16} />
					</div>
				)} */}
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
							maxLength={50}
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
					<DisabledTooltip
						title={isLocked ? "Not available whilst editing" : "Delete"}
						placement="bottom"
					>
						<IconButton
							disabled={isLocked}
							onClick={() => handleDeleteClick(id)}
						>
							<DeleteForeverIcon color="delete" />
						</IconButton>
					</DisabledTooltip>
				</div>
				<div>
					<DisabledTooltip
						title={
							isActionDisabled("highPriority")
								? "Please Wait..."
								: "Toggle High Priority"
						}
						placement="bottom"
					>
						<IconButton
							disabled={isActionDisabled("highPriority")}
							onClick={() => handleFlagClick("highPriority", highPriority)}
							onPointerDown={(e) => onFlagPointerDown(e, "highPriority")}
						>
							<PriorityHighIcon
								value={highPriority}
								color={highPriority ? "urgent" : "disabled"}
							/>
						</IconButton>
					</DisabledTooltip>
				</div>

				<div>
					<DisabledTooltip
						title={
							isActionDisabled("dashTask")
								? "Please Wait..."
								: "Toggle Dash Task"
						}
						placement="bottom"
					>
						<IconButton
							disabled={isActionDisabled("dashTask")}
							onClick={() => handleFlagClick("dashTask", dashTask)}
							onPointerDown={(e) => onFlagPointerDown(e, "dashTask")}
						>
							<ElectricBoltIcon
								value={dashTask}
								color={dashTask ? "dash" : "disabled"}
							/>
						</IconButton>
					</DisabledTooltip>
				</div>

				<div>
					<DisabledTooltip
						title={isActionDisabled("done") ? "Please Wait..." : "Toggle Done"}
						placement="bottom"
					>
						<IconButton
							disabled={isActionDisabled("done")}
							onClick={() => handleFlagClick("done", done)}
							onPointerDown={(e) => onFlagPointerDown(e, "done")}
						>
							<CheckCircleIcon
								value={done}
								color={done ? "success" : "disabled"}
							/>
						</IconButton>
					</DisabledTooltip>
				</div>
			</div>
		</div>
	);
}

export default Card;
