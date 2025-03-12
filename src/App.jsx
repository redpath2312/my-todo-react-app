import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Main from "./main";
import Dashboard from "./Dashboard";
import Login from "./Login";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import DraftCard from "./Components/DraftCard";
import Card from "./Components/Card";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

function App({
	isAuth,
	dbCards,
	addCardToDB,
	readCardsFromDB,
	updateCardsInDB,
	deleteCardInDB,
	clearDoneCardsInDB,
	deleteAllCardsInDB,
}) {
	// console.log(cards);
	// const [cards, setCards] = useState(initialCards || []);
	// const [maxIndexKey, setMaxIndexKey] = useState(initialCards.length || 0);

	const [localCards, setLocalCards] = useState([]);
	const [isGuest, setIsGuest] = useState(false);
	const cards = isAuth ? dbCards : localCards;
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
		console.log("Handle Delete All Cards");
		await deleteAllCardsInDB();
		readCardsFromDB();
	}
	async function handleClearAllDoneTasks() {
		console.log("Clear All Done");
		const clearedDoneCards = cards.filter((card) => !card.checked);
		console.log(clearedDoneCards);
		await clearDoneCardsInDB(clearedDoneCards);
		readCardsFromDB();
	}

	function handleCheckedChanged(id) {
		cards.map((card) => {
			if (card.id === id) {
				updateCardsInDB(id, { checked: !card.checked });
			} else {
				return card;
			}
		});
	}

	function handlePriorityChanged(id) {
		cards.map((card) => {
			if (card.id === id) {
				updateCardsInDB(id, { highPriority: !card.highPriority });
			} else {
				return card;
			}
		});
	}

	function selectCard(id) {
		setSelectedCardID(id);
		console.log(id);
	}

	// function getCards() {
	// 	readDBList();
	// }

	function addCard(inputText) {
		addCardToDB(inputText);
	}

	function deleteCard(id) {
		deleteCardInDB(id);
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
	// console.log(cards);

	// checkDBCards();

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						isAuth || isGuest ? (
							<Dashboard
								isAuth={isAuth}
								isGuest={isGuest}
								dbCards={dbCards}
								addCardToDB={addCardToDB}
								readCardsFromDB={readCardsFromDB}
								updateCardsInDB={updateCardsInDB}
								deleteCardInDB={deleteCardInDB}
								clearDoneCardsInDB={clearDoneCardsInDB}
								deleteAllCardsInDB={deleteAllCardsInDB}
							/>
						) : (
							<Navigate to="/login" />
						)
					}
				/>
				<Route path="/login" element={<Login />} />
			</Routes>
		</Router>
	);
}

export default App;
