import NoteAddIcon from "@mui/icons-material/NoteAdd";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

const Tips = () => {
	return (
		<div className="tips widget" id="getting-started-tips">
			<h2 className="h2-heading">Getting Started Tips</h2>
			<div className="tips-panels">
				<div className="panel-inner">
					<h3 className="h3-heading">1. Create</h3>
					<ul>
						<li>Type task in &quot;Create&quot; box</li>
						<li>
							Mark <PriorityHighIcon color="urgent" /> if High Priority
						</li>
						<li>
							Mark <ElectricBoltIcon color="dash" /> if quick Dash Task
						</li>
						<li>
							Click add button <NoteAddIcon color="secondary" />
						</li>
						<li>Task is added to corresponding section</li>
					</ul>
				</div>
				<div className="panel-inner">
					<h3 className="h3-heading">2. Edit</h3>
					<ul>
						<li>Click on the task to update text</li>
						<li>
							Update Priority <PriorityHighIcon color="urgent" /> or Dash{" "}
							<ElectricBoltIcon color="dash" /> if needed
						</li>
						<li>
							Click <DeleteForeverIcon /> to delete task
						</li>
						<li>
							Tip - Aim for less huge tasks and split into more Dash Tasks
						</li>
					</ul>
				</div>
				<div className="panel-inner">
					<h3 className="h3-heading">3. Do</h3>
					<ul>
						<li>The age of the task will be displayed on the top right</li>
						<li>
							If done click <CheckCircleIcon color="success" /> - it will move
							to done section
						</li>
						<li>
							{" "}
							To clear all done tasks click{" "}
							<PublishedWithChangesIcon color="success" /> in
							&quot;Actions&quot; Panel
						</li>
						<li>
							To start over, click <DeleteSweepIcon color="delete" /> in
							&quot;Actions&quot; Panel
						</li>
					</ul>
				</div>
			</div>
			<h3 className="h3-heading">
				Note - Guest Mode doesn&apos;t store your tasks, login first if you will
				want to save them after your session or in case of disconnection.{" "}
			</h3>
		</div>
	);
};

export default Tips;
