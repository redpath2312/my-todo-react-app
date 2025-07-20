import Card from "./Card";

const Swimlane = ({
	title,
	cards = [],
	hidden = true,
	containerClass = "",
	headingID = "",
	onDelete,
	onTextUpdate,
	onSelect,
	onFlagToggle,
}) => {
	if (hidden) return null;

	return (
		<>
			<div className="swimlane-heading" id={headingID}>
				<h3>{title}</h3>
			</div>
			<div className={containerClass}>
				{cards.map((card) => (
					<Card
						key={card.renderKey}
						id={card.id}
						text={card.text}
						done={card.done}
						highPriority={card.highPriority}
						onDelete={onDelete}
						onTextUpdate={onTextUpdate}
						onSelect={onSelect}
						onFlagToggle={onFlagToggle}
					/>
				))}
			</div>
		</>
	);
};

export default Swimlane;
