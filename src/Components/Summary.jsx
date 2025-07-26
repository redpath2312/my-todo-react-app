import SummaryStats from "./SummaryStats";

const Summary = ({
	cardsTotal,
	highPriorityCardsTotal,
	dashTaskCardsTotal,
	doneCardsTotal,
}) => {
	return (
		<div className="summary widget">
			<h2 className="h2-heading">Summary</h2>

			<SummaryStats
				cardsTotal={cardsTotal}
				highPriorityCardsTotal={highPriorityCardsTotal}
				dashTaskCardsTotal={dashTaskCardsTotal}
				doneCardsTotal={doneCardsTotal}
			/>
		</div>
	);
};

export default Summary;
