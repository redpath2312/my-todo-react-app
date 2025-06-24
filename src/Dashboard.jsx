import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import DraftCard from "./Components/DraftCard";
import Card from "./Components/Card";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { useAuth } from "./AuthContext";
import ErrorDisplay from "./Components/ErrorDisplay";

const Dashboard = ({
	dbCards,
	addCardToDB,
	readCardsFromDB,
	updateCardsInDB,
	deleteCardInDB,
	clearDoneCardsInDB,
	deleteAllCardsInDB,
	isAdding,
}) => {
	const [localCards, setLocalCards] = useState([]);
	const { user, userState } = useAuth();

	const cards =
		userState === "loggedIn"
			? dbCards
			: userState === "guest"
			? localCards
			: [];
	const [maxLocalIndexKey, setMaxLocalIndexKey] = useState(0);
	const [selectedCardID, setSelectedCardID] = useState(null);

	const doneCards = cards.filter((card) => card.checked == true);
	const doneCardsTotal = doneCards.length;
	const highPriorityCards = cards.filter(
		(card) => card.highPriority == true && !card.checked
	);
	const highPriorityCardsTotal = highPriorityCards.length;
	const allOtherCards = cards.filter(
		(card) => card.highPriority == false && !card.checked
	);

	const doneCardsHidden = doneCards.length === 0;
	const highPriorityHidden = highPriorityCards.length === 0;
	const allOtherCardsHidden = allOtherCards.length === 0;

	useEffect(() => {
		// console.log("dbcards have changed");
	}, [dbCards]); // New Use Effect

	async function handleDeleteAll() {
		if (userState === "loggedIn") {
			await deleteAllCardsInDB();
			readCardsFromDB();
		} else {
			setLocalCards([]);
		}
	}
	async function handleClearAllDoneTasks() {
		const clearedDoneCards = cards.filter((card) => !card.checked);
		if (userState === "loggedIn") {
			await clearDoneCardsInDB(clearedDoneCards);
			readCardsFromDB();
		} else {
			setLocalCards(clearedDoneCards);
		}
	}

	function handleCheckedChanged(id) {
		if (userState === "loggedIn") {
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
		if (userState === "loggedIn") {
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
	}

	function addCard(inputText) {
		if (userState === "loggedIn") {
			addCardToDB(inputText);
		} else {
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
		if (userState === "loggedIn") {
			deleteCardInDB(id);
		} else {
			const newLocalCardsList = localCards.filter((card) => card.id != id);
			setLocalCards(newLocalCardsList);
		}
	}

	function handleTextChange(updatedText) {
		cards.map((card) => {
			if (card.id === selectedCardID) {
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
					<Header />
				</div>
				<div className="summary">
					<div id="summary-heading">
						<h2 className="text-2xl font-semibold my-2">Summary</h2>
					</div>
					<h3 className="text-xl font-medium my-1"> You Have:</h3>
					<p className="text-gray-700">{cards.length} Total Tasks</p>
					<p className="text-gray-700">
						{highPriorityCardsTotal} High Priority Tasks
					</p>
					<p className="text-gray-700">{doneCardsTotal} Tasks Done</p>

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
					<DraftCard onAdd={addCard} isAdding={isAdding} />
				</div>

				{!highPriorityHidden && (
					<>
						<div className="swimlane-heading" id="high-priority-heading">
							<h3>High Priority</h3>
						</div>

						<div className="high-priority-cards-container">
							{highPriorityCards.map((card) => (
								<Card
									key={card.key}
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
					</>
				)}

				{!allOtherCardsHidden && (
					<>
						<div className="swimlane-heading" id="all-other-tasks-heading">
							<h3>All Other Tasks</h3>
						</div>
						<div className="cards-container">
							{allOtherCards.map((card) => (
								<Card
									key={card.key}
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
					</>
				)}

				{!doneCardsHidden && (
					<>
						<div className="swimlane-heading" id="done-tasks-heading">
							<h3>Tasks Done</h3>
						</div>
						<div className="done-cards-container">
							{doneCards.map((card) => (
								<Card
									key={card.key}
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
					</>
				)}
			</div>

			<div>
				<Footer />
			</div>
			<ErrorDisplay />
		</div>
	);
};
export default Dashboard;
