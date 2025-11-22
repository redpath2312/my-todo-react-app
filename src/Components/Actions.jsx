import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import { DisabledTooltip } from "./DisabledTooltip";
const Actions = ({
	isTipsHidden,
	handleTipsHidden,
	handleClearAllDoneTasks,
	handleDeleteAll,
	editingLockRefCurrent,
	doneCardsTotal,
	cardsTotal,
	handlePrivacy,
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
						aria-label={
							isTipsHidden
								? "Show Getting Started Tips"
								: "Hide Getting Started Tips"
						}
						aria-controls="getting-started-tips"
						sx={{ opacity: isTipsHidden ? 0.5 : 1, transition: "opacity .2s" }}
						onClick={handleTipsHidden}
					>
						<TipsAndUpdatesIcon fontSize="large" color="dash" />
					</IconButton>
				</Tooltip>

				<DisabledTooltip title={clearDoneTitle} placement="bottom">
					<IconButton
						disabled={clearDoneDisabled}
						aria-label="Clear done tasks"
						onClick={!clearDoneDisabled ? handleClearAllDoneTasks : undefined}
					>
						<PublishedWithChangesIcon fontSize="large" color="success" />
					</IconButton>
				</DisabledTooltip>

				<DisabledTooltip title={deleteAllTitle} placement="bottom">
					<IconButton
						disabled={deleteAllDisabled}
						aria-label="Delete all tasks"
						onClick={!deleteAllDisabled ? handleDeleteAll : undefined}
					>
						<DeleteSweepIcon fontSize="large" color="delete" />
					</IconButton>
				</DisabledTooltip>

				<DisabledTooltip title="Data & Privacy" placement="bottom">
					<IconButton
						onClick={handlePrivacy}
						aria-label="Open Data & Privacy Info"
					>
						<PrivacyTipIcon fontSize="large" color="secondary" />
					</IconButton>
				</DisabledTooltip>
			</div>
		</div>
	);
};
export default Actions;
