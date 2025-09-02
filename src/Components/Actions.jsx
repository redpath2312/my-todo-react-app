import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

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

				<Tooltip title="Clear Done Tasks" placement="bottom">
					<IconButton
						disabled={doneCardsTotal === 0 || editingLockRefCurrent}
						onClick={handleClearAllDoneTasks}
					>
						<PublishedWithChangesIcon fontSize="large" color="success" />
					</IconButton>
				</Tooltip>

				<Tooltip title="Delete All Tasks" placement="bottom">
					<IconButton
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
