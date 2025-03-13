import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import DraftCard from "./Components/DraftCard";
import Card from "./Components/Card";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

const Dashboard = ({
	isAuth,
	isGuest,
	dbCards,
	addCardToDB,
	readCardsFromDB,
	updateCardsInDB,
	deleteCardInDB,
	clearDoneCardsInDB,
	deleteAllCardsInDB,
}) => {
	const [localCards, setLocalCards] = useState([]);
	const cards = isAuth ? dbCards : localCards;
	const [maxLocalIndexKey, setMaxLocalIndexKey] = useState(0);
	const [selectedCardID, setSelectedCardID] = useState(null);
	const [highPriorityHidden, setHighPriorityHidden] = useState(true);
	const [allOtherCardsHidden, setAllOtherCardsHidden] = useState(true);
	const [doneCardsHidden, setDoneCardsHidden] = useState(true);

	const doneCards = cards.filter((card) => card.checked == true);
	const doneCardsTotal = doneCards.length;
	const highPriorityCards = cards.filter(
		(card) => card.highPriority == true && !card.checked
	);
	const highPriorityCardsTotal = highPriorityCards.length;
	const allOtherCards = cards.filter(
		(card) => card.highPriority == false && !card.checked
	);
	const allOtherCardsTotal = allOtherCards.length;

	// Update state whenever props.cards changes
	// useEffect(() => {
	// 	setCards(cards || []);
	// }, [cards]); // Runs whenever initialCards changes

	function checkDBCards() {
		console.log("Props are", cards);
	}

	async function handleDeleteAll() {
		if (isAuth) {
			await deleteAllCardsInDB();
			readCardsFromDB();
		} else {
			setLocalCards([]);
		}
	}
	async function handleClearAllDoneTasks() {
		const clearedDoneCards = cards.filter((card) => !card.checked);
		if (isAuth) {
			await clearDoneCardsInDB(clearedDoneCards);
			readCardsFromDB();
		} else {
			setLocalCards(clearedDoneCards);
		}
	}

	function handleCheckedChanged(id) {
		if (isAuth) {
			cards.map((card) => {
				if (card.id === id) {
					updateCardsInDB(id, { checked: !card.checked });
				} else {
					return card;
				}
			});
		} else {
			const newCards = cards.map((card) => {
				if (card.id === id) {
					return { ...card, checked: !card.checked };
				} else {
					return card;
				}
			});
			setLocalCards(newCards);
		}
	}

	function handlePriorityChanged(id) {
		if (isAuth) {
			cards.map((card) => {
				if (card.id === id) {
					updateCardsInDB(id, { highPriority: !card.highPriority });
				} else {
					return card;
				}
			});
		} else {
			const newCards = cards.map((card) => {
				if (card.id === id) {
					return { ...card, highPriority: !card.highPriority };
				} else {
					return card;
				}
			});
			setLocalCards(newCards);
		}
	}

	function selectCard(id) {
		setSelectedCardID(id);
		console.log(id);
	}

	// function getCards() {
	// 	readDBList();
	// }

	function addCard(inputText) {
		if (isAuth) {
			addCardToDB(inputText);
		} else {
			console.log("Guest so not adding card to db");

			setLocalCards((prevCards) => {
				return [
					...prevCards,
					{
						id: maxLocalIndexKey + 1,
						text: inputText,
						checked: false,
						key: maxLocalIndexKey + 1,
						highPriority: false,
					},
				];
			});
			setMaxLocalIndexKey(maxLocalIndexKey + 1);
		}
	}

	function deleteCard(id) {
		if (isAuth) {
			deleteCardInDB(id);
		} else {
			const newLocalCardsList = localCards.filter((card) => card.key != id);
			setLocalCards(newLocalCardsList);
		}
	}

	// console.log(cards);

	//should only use useEffect in external calls - read doc algren sent
	useEffect(() => {
		checkDoneCardsDisplay();
		checkHighPriorityCardsDisplay();
		checkAllOtherCardsDisplay();
	}, [cards]);

	function checkDoneCardsDisplay() {
		if (doneCardsTotal > 0) {
			setDoneCardsHidden(false);
		} else {
			setDoneCardsHidden(true);
		}
	}
	function checkHighPriorityCardsDisplay() {
		if (highPriorityCardsTotal > 0) {
			setHighPriorityHidden(false);
		} else {
			setHighPriorityHidden(true);
		}
	}

	function checkAllOtherCardsDisplay() {
		if (allOtherCardsTotal > 0) {
			setAllOtherCardsHidden(false);
		} else {
			setAllOtherCardsHidden(true);
		}
	}

	function handleTextChange(updatedText) {
		cards.map((card) => {
			if (card.id === selectedCardID) {
				console.log("Found Selected ID");
				updateCardsInDB(selectedCardID, { text: updatedText });
			} else {
				return card;
			}
		});
	}

	return (
		<div className="main-page-container">
			<div className="main">
				<div>
					<Header isAuth={isAuth} isGuest={isGuest} />
				</div>
				<div className="summary">
					<div id="summary-heading">
						<h2>Summary</h2>
					</div>
					<h3> You Have:</h3>
					<p>{cards.length} Total Tasks</p>
					<p>{highPriorityCardsTotal} High Priority Tasks</p>
					<p>{doneCardsTotal} Tasks Done</p>

					<div>
						<Tooltip title="Clear Done Tasks" placement="left">
							<IconButton onClick={handleClearAllDoneTasks}>
								<PublishedWithChangesIcon fontSize="large" color="primary" />
							</IconButton>
						</Tooltip>

						<Tooltip title="Delete All Tasks" placement="right">
							<IconButton onClick={handleDeleteAll}>
								<DeleteSweepIcon fontSize="large" color="primary" />
							</IconButton>
						</Tooltip>
					</div>
				</div>
				<div className="draft-card-container">
					<DraftCard onAdd={addCard} />
				</div>
				<div className="swimlane-heading" id="high-priority-heading">
					{!highPriorityHidden && <h3>High Priority</h3>}
				</div>
				<div className="high-priority-cards-container">
					{highPriorityCards.map((card) => (
						<Card
							key={card.id}
							id={card.id}
							text={card.text}
							checked={card.checked}
							highPriority={card.highPriority}
							onCheckedChange={handleCheckedChanged}
							onPriorityChange={handlePriorityChanged}
							onDelete={deleteCard}
							onTextUpdate={handleTextChange}
							onSelect={selectCard}
						/>
					))}
				</div>
				<div className="swimlane-heading" id="all-other-tasks-heading">
					{!allOtherCardsHidden && <h3>All Other Tasks</h3>}
				</div>
				<div className="cards-container">
					{allOtherCards.map((card) => (
						<Card
							key={card.id}
							id={card.id}
							text={card.text}
							checked={card.checked}
							highPriority={card.highPriority}
							onCheckedChange={handleCheckedChanged}
							onPriorityChange={handlePriorityChanged}
							onDelete={deleteCard}
							onTextUpdate={handleTextChange}
							onSelect={selectCard}
						/>
					))}
				</div>
				<div className="swimlane-heading" id="done-tasks-heading">
					{!doneCardsHidden && <h3>Tasks Done</h3>}
				</div>

				<div className="done-cards-container">
					{doneCards.map((card) => (
						<Card
							key={card.id}
							id={card.id}
							text={card.text}
							checked={card.checked}
							highPriority={card.highPriority}
							onCheckedChange={handleCheckedChanged}
							onPriorityChange={handlePriorityChanged}
							onDelete={deleteCard}
							onTextUpdate={handleTextChange}
							onSelect={selectCard}
						/>
					))}
				</div>
			</div>
			<div>
				<Footer />
			</div>
		</div>
	);
};
export default Dashboard;
