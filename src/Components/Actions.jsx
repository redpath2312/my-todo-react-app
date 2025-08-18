import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ThemeModeToggle from "./Buttons/ThemeModeToggle";

const Actions = ({
	isTipsHidden,
	handleTipsHidden,
	handleClearAllDoneTasks,
	handleDeleteAll,
	editingLockRefCurrent,
	doneCardsTotal,
	cardsTotal,
}) => {
	return (
		<div className="card-actions widget">
			<div className="card-actions-buttons">
				<h2 className="h2-heading">Actions</h2>
				<Tooltip title="Toggle Getting Started Tips" placement="bottom">
					<IconButton className={isTipsHidden ? "button-toggle-off" : ""}>
						<TipsAndUpdatesIcon fontSize="large" color="dash" />
					</IconButton>
				</Tooltip>

				<Tooltip title="Clear Done Tasks" pplacement="bottom">
					<IconButton
						className={doneCardsTotal === 0 ? "button-disabled" : ""}
						disabled={doneCardsTotal === 0 || editingLockRefCurrent}
						onClick={handleClearAllDoneTasks}
					>
						<PublishedWithChangesIcon fontSize="large" color="success" />
					</IconButton>
				</Tooltip>

				<Tooltip title="Delete All Tasks" placement="bottom">
					<IconButton
						className={cardsTotal === 0 ? "button-disabled" : ""}
						disabled={cardsTotal === 0 || editingLockRefCurrent}
						onClick={handleDeleteAll}
					>
						<DeleteSweepIcon fontSize="large" color="delete" />
					</IconButton>
				</Tooltip>
			</div>
		</div>
	);
};
export default Actions;
