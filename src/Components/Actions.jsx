import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import { DisabledTooltip } from "./DisabledTooltip";
const Actions = ({
	isTipsHidden,
	handleTipsHidden,
	handleClearAllDoneTasks,
	handleDeleteAll,
	editingLockRefCurrent,
	doneCardsTotal,
	cardsTotal,
}) => {
	// Centralised “disabled” logic
	const isLocked = !!editingLockRefCurrent;
	const hasDone = doneCardsTotal > 0;
	const hasAny = cardsTotal > 0;

	const clearDoneDisabled = isLocked || !hasDone;
	const deleteAllDisabled = isLocked || !hasAny;

	// Tooltip messages encode *why* it’s disabled
	const clearDoneTitle = isLocked
		? "Busy… please wait"
		: !hasDone
		? "No done tasks to clear"
		: "Clear Done Tasks";

	const deleteAllTitle = isLocked
		? "Busy… please wait"
		: !hasAny
		? "No tasks to delete"
		: "Delete All Tasks";

	return (
		<div className="panel-inner">
			<div className="card-actions-buttons">
				<h2 className="h2-heading">Actions</h2>
				<Tooltip title="Toggle Getting Started Tips" placement="bottom">
					<IconButton
						aria-pressed={isTipsHidden} // announces toggle state
						aria-label={isTipsHidden ? "Show tips" : "Hide tips"}
						sx={{ opacity: isTipsHidden ? 0.5 : 1, transition: "opacity .2s" }}
						onClick={handleTipsHidden}
					>
						<TipsAndUpdatesIcon fontSize="large" color="dash" />
					</IconButton>
				</Tooltip>

				<DisabledTooltip title={clearDoneTitle} placement="bottom">
					<IconButton
						disabled={clearDoneDisabled}
						onClick={!clearDoneDisabled ? handleClearAllDoneTasks : undefined}
						// optional: ensure cursor doesn’t show as clickable when disabled
						style={clearDoneDisabled ? { pointerEvents: "none" } : undefined}
					>
						<PublishedWithChangesIcon fontSize="large" color="success" />
					</IconButton>
				</DisabledTooltip>

				<DisabledTooltip title={deleteAllTitle} placement="bottom">
					<IconButton
						disabled={deleteAllDisabled}
						onClick={!deleteAllDisabled ? handleDeleteAll : undefined}
						// optional: ensure cursor doesn’t show as clickable when disabled
						style={deleteAllDisabled ? { pointerEvents: "none" } : undefined}
					>
						<DeleteSweepIcon fontSize="large" color="delete" />
					</IconButton>
				</DisabledTooltip>
			</div>
		</div>
	);
};
export default Actions;
