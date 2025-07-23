import { Typography } from "@mui/material";
const SummaryStats = ({
	cardsTotal,
	highPriorityCardsTotal,
	dashTaskCardsTotal,
	doneCardsTotal,
}) => {
	return (
		<div>
			<h3 className="text-xl font-medium my-1">
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
						High Priority Tasks
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
