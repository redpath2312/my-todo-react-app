import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

const Tips = () => {
	return (
		<div className="tips widget">
			<h2 className="h2-heading">Getting Started Tips</h2>
			<div>
				<div id="tips-panel-small">
					<h3 className="h3-heading">1. Create</h3>
					<ul>
						<li>Type task in "Create" box</li>
						<li>
							Mark task if High Priority <PriorityHighIcon color="urgent" /> or
							quick Dash Task <ElectricBoltIcon color="dash" />
						</li>
						<li>
							Click add button <NoteAddIcon color="secondary" />
						</li>
						<li>Card will be added to the corresponding section</li>
					</ul>
				</div>
				<div id="tips-panel-small">
					<h3 className="h3-heading">2. Edit</h3>
					<ul>
						<li>Click on the card if need to update the text</li>
						<li>
							Cards can later be marked High Priority{" "}
							<PriorityHighIcon color="urgent" /> or a Dash task{" "}
							<ElectricBoltIcon color="dash" />
						</li>
						<li>
							If made a mistake, card can be deleted <DeleteForeverIcon />
						</li>
					</ul>
				</div>
				<div id="tips-panel-small">
					<h3 className="h3-heading">3. Do</h3>
					<ul>
						<li>
							Click the done icon <CheckCircleIcon color="success" /> to move it
							to the done section
						</li>
						<li>
							{" "}
							To clear all done cards click{" "}
							<PublishedWithChangesIcon color="secondary" /> in "Actions" Panel.
						</li>
						<li>
							To wipe and start fresh board, click Delete All button.{" "}
							<DeleteSweepIcon color="secondary" />
						</li>
					</ul>
				</div>
				<h3 className="h3-heading">
					Note - Guest Mode doesn't save your cards, login first if want to save
					tasks.{" "}
				</h3>
			</div>
		</div>
	);
};

export default Tips;
