import { toMillisSafe } from "../utils/timeElapsed";
import Card from "./Card";
import React from "react";

const MemoCard = React.memo(Card);

const Swimlane = React.memo(function Swimlane({
	title,
	cards = [],
	hidden = true,
	containerClass = "",
	headingID = "",
	onDelete,
	onTextUpdate,
	onSelect,
	onFlagToggle,
}) {
	if (hidden) return null;

	return (
		<>
			<div className="swimlane-heading widget" id={headingID}>
				<h3>{title}</h3>
				<div className={containerClass}>
					{cards.map((card) => (
						<MemoCard
							key={card.renderKey}
							id={card.id}
							text={card.text}
							done={card.done}
							highPriority={card.highPriority}
							dashTask={card.dashTask}
							onDelete={onDelete}
							onTextUpdate={onTextUpdate}
							onSelect={onSelect}
							onFlagToggle={onFlagToggle}
							createdAtMs={toMillisSafe(card.createdAt)}
						/>
					))}
				</div>
			</div>
		</>
	);
});

export default Swimlane;
