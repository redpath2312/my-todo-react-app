import { Typography } from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";

const SummaryStats = ({
	cardsTotal,
	dashTaskCardsTotal,
	doneCardsTotal,
	allOtherCardsTotal,
	hpDashTotal,
	hpOnlyTotal,
}) => {
	// const dashRowLabel = hpDashTotal > 0 ? "Other Dash Tasks" : "Dash Tasks";

	return (
		<div className="summary-inner">
			<h3 className="h3-heading">
				You have{" "}
				<Typography component="span" color="primary" fontWeight={700}>
					{cardsTotal}
				</Typography>{" "}
				total tasks
			</h3>

			<div className="summary-stats-rows">
				{/* High Priority (hp-dash) */}
				<div className={`summary-row ${hpDashTotal ? "" : "is-zero"}`}>
					<span className="summary-number">
						<Typography component="span" color="urgent" fontWeight={700}>
							{hpDashTotal}
						</Typography>
					</span>
					<span className="summary-icon" aria-hidden>
						<Typography component="span" color="text.primary">
							<PriorityHighIcon
								fontSize="small"
								color="urgent"
								sx={{ verticalAlign: "text-bottom" }}
							/>
							<ElectricBoltIcon
								fontSize="small"
								color="dash"
								sx={{ verticalAlign: "text-bottom" }}
							/>
							{/* {dashRowLabel} */}
						</Typography>
					</span>
					<span className="summary-label">High Priority Dash Tasks</span>
				</div>

				{/* High Priority (non-dash) */}
				<div className={`summary-row ${hpOnlyTotal ? "" : "is-zero"}`}>
					<span className="summary-number">
						<Typography component="span" color="urgent" fontWeight={700}>
							{hpOnlyTotal}
						</Typography>
					</span>
					<span className="summary-icon">
						<Typography component="span" color="text.primary">
							<PriorityHighIcon
								fontSize="small"
								color="urgent"
								sx={{ verticalAlign: "text-bottom" }}
							/>
						</Typography>
					</span>
					<span className="summary-label">Other High Priority Tasks</span>
				</div>

				{/* Dash (non-high) */}
				<div className={`summary-row ${dashTaskCardsTotal ? "" : "is-zero"}`}>
					<span className="summary-number">
						<Typography component="span" color="dash" fontWeight={700}>
							{dashTaskCardsTotal}
						</Typography>
					</span>
					<span className="summary-icon">
						<Typography component="span" color="text.primary">
							<ElectricBoltIcon
								fontSize="small"
								color="dash"
								sx={{ verticalAlign: "text-bottom" }}
							/>
						</Typography>
					</span>
					<span className="summary-label">Other Dash Tasks </span>
				</div>

				{/* All Other */}
				<div className={`summary-row ${allOtherCardsTotal ? "" : "is-zero"}`}>
					<span className="summary-number">
						<Typography component="span" color="secondary" fontWeight={700}>
							{allOtherCardsTotal}
						</Typography>
					</span>
					<span className="summary-icon">
						<Typography component="span" color="text.primary">
							<AssignmentIcon
								fontSize="small"
								color="secondary"
								sx={{ verticalAlign: "text-bottom" }}
							/>
						</Typography>
					</span>
					<span className="summary-label">All Other Tasks</span>
				</div>

				{/* Done */}
				<div className={`summary-row ${doneCardsTotal ? "" : "is-zero"}`}>
					<span className="summary-number">
						<Typography component="span" color="success" fontWeight={700}>
							{doneCardsTotal}
						</Typography>
					</span>
					<span className="summary-icon">
						<Typography component="span" color="text.primary">
							<CheckCircleIcon
								color="success"
								fontSize="small"
								sx={{ verticalAlign: "text-bottom" }}
							/>
						</Typography>
					</span>
					<span className="summary-label">Tasks Done</span>
				</div>
			</div>
		</div>
	);
};

export default SummaryStats;
