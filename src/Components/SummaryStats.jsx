import { Typography } from "@mui/material";
const SummaryStats = ({
	cardsTotal,
	highPriorityCardsTotal,
	dashTaskCardsTotal,
	doneCardsTotal,
	allOtherCardsTotal,
	hpDashTotal,
}) => {
	return (
		<div className="summary-inner">
			<h3 className="h3-heading">
				You have{" "}
				<Typography component="span" color="secondary" fontWeight={700}>
					{cardsTotal}
				</Typography>{" "}
				total tasks
			</h3>

			<div className="summary-stats-rows">
				<div className="summary-row">
					<span className="summary-number">
						<Typography component="span" color="urgent" fontWeight={700}>
							{highPriorityCardsTotal}
						</Typography>
					</span>
					<span className="summary-description text-gray-700">
						High Priority Tasks (Inc. {`${hpDashTotal} Dash Tasks`})
					</span>
				</div>

				<div className="summary-row">
					<span className="summary-number">
						<Typography component="span" color="dash" fontWeight={700}>
							{dashTaskCardsTotal}
						</Typography>
					</span>
					<span className="summary-description text-gray-700">
						Other Dash Tasks
					</span>
				</div>

				<div className="summary-row">
					<span className="summary-number">
						<Typography component="span" color="secondary" fontWeight={700}>
							{allOtherCardsTotal}
						</Typography>
					</span>
					<span className="summary-description text-gray-700">
						All Other Tasks
					</span>
				</div>

				<div className="summary-row">
					<span className="summary-number">
						<Typography component="span" color="success" fontWeight={700}>
							{doneCardsTotal}
						</Typography>
					</span>
					<span className="summary-description text-gray-700">Tasks Done</span>
				</div>
			</div>
		</div>
	);
};

export default SummaryStats;
