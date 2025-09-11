import SummaryStats from "./SummaryStats";

const Summary = ({
	cardsTotal,
	highPriorityCardsTotal,
	dashTaskCardsTotal,
	doneCardsTotal,
	allOtherCardsTotal,
	hpDashTotal,
}) => {
	return (
		<div className="panel-inner">
			<h2 className="h2-heading">Summary</h2>

			<SummaryStats
				cardsTotal={cardsTotal}
				highPriorityCardsTotal={highPriorityCardsTotal}
				dashTaskCardsTotal={dashTaskCardsTotal}
				doneCardsTotal={doneCardsTotal}
				allOtherCardsTotal={allOtherCardsTotal}
				hpDashTotal={hpDashTotal}
			/>
		</div>
	);
};

export default Summary;
