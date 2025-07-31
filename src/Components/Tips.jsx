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
			<div className="tips-panels">
				<div id="tips-panel-small">
					<h3 className="h3-heading">1. Create</h3>
					<ul>
						<li>Type task in "Create" box</li>
						<li>
							Mark <PriorityHighIcon color="urgent" /> if High Priority
						</li>
						<li>
							Mark <ElectricBoltIcon color="dash" /> if quick Dash Task
						</li>
						<li>
							Click add button <NoteAddIcon color="secondary" />
						</li>
						<li>Card is added to corresponding section</li>
					</ul>
				</div>
				<div id="tips-panel-small">
					<h3 className="h3-heading">2. Edit</h3>
					<ul>
						<li>Click on the card to update text</li>
						<li>
							Update Priority <PriorityHighIcon color="urgent" /> or Dash{" "}
							<ElectricBoltIcon color="dash" /> if needed.
						</li>
						<li>
							Click <DeleteForeverIcon /> to delete card
						</li>
					</ul>
				</div>
				<div id="tips-panel-small">
					<h3 className="h3-heading">3. Do</h3>
					<ul>
						<li>
							If done click <CheckCircleIcon color="success" /> - it will move
							to done section
						</li>
						<li>
							{" "}
							To clear all done cards click{" "}
							<PublishedWithChangesIcon color="secondary" /> in "Actions" Panel
						</li>
						<li>
							To start fresh board, click Delete All button in "Actions Panel"
							<DeleteSweepIcon color="secondary" />
						</li>
					</ul>
				</div>
			</div>
			<h3 className="h3-heading">
				Note - Guest Mode doesn't save your cards, login first if want to save
				tasks.{" "}
			</h3>
		</div>
	);
};

export default Tips;
