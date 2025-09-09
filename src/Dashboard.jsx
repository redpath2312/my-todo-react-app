import React, { useState, useEffect } from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import DraftCard from "./Components/DraftCard";

import { useAuth } from "./AuthContext";
import ErrorDisplay from "./Components/ErrorDisplay";
import { useUI } from "./UIContext";
import Swimlane from "./Components/Swimlane";
import Summary from "./Components/Summary";
import Tips from "./Components/Tips";
import Actions from "./Components/Actions";
const Dashboard = ({
	dbCards,
	addCardToDB,
	updateCardsInDB,
	deleteCardInDB,
	clearDoneCardsInDB,
	deleteAllCardsInDB,
	isAdding,
}) => {
	const [localCards, setLocalCards] = useState([]);
	const { userState } = useAuth();
	const { editingLocked, editingLockRef } = useUI();
	const [isTipsHidden, setTipsHidden] = useState(false);

	const cards =
		userState === "loggedIn"
			? dbCards
			: userState === "guest"
			? localCards
			: [];
	const [maxLocalIndexKey, setMaxLocalIndexKey] = useState(0);
	const [selectedCardID, setSelectedCardID] = useState(null);

	const {
		cardsTotal,
		doneCards,
		doneCardsTotal,
		dashTaskCards,
		dashTaskCardsTotal,
		highPriorityCards,
		highPriorityCardsTotal,
		allOtherCards,
		doneCardsHidden,
		highPriorityHidden,
		dashTasksHidden,
		allOtherCardsHidden,
	} = getCardFilters(cards);

	function getCardFilters(cards) {
		const doneCards = (cards || []).filter((card) => card.done === true);
		const highPriorityCards = (cards || []).filter(
			(card) => card.highPriority === true && !card.done
		);
		const dashTaskCards = (cards || []).filter(
			(card) =>
				card.dashTask === true && !card.highPriority === true && !card.done
		);
		const allOtherCards = (cards || []).filter(
			(card) =>
				card.highPriority === false && card.dashTask === false && !card.done
		);
		return {
			cardsTotal: (cards || []).length,
			doneCards,
			doneCardsTotal: (doneCards || []).length,
			highPriorityCards,
			highPriorityCardsTotal: highPriorityCards.length || 0,
			dashTaskCards,
			dashTaskCardsTotal: dashTaskCards.length || 0,
			allOtherCards,
			doneCardsHidden: doneCards.length === 0,
			highPriorityHidden: highPriorityCards.length === 0,
			dashTasksHidden: dashTaskCards.length === 0,
			allOtherCardsHidden: allOtherCards.length === 0,
		};
	}

	useEffect(() => {}, [dbCards]); // New Use Effect

	async function handleDeleteAll() {
		if (editingLockRef === true) return;
		if (userState === "loggedIn") {
			await deleteAllCardsInDB();
		} else {
			setLocalCards([]);
		}
	}
	async function handleClearAllDoneTasks() {
		if (editingLockRef === true) return;
		const clearedDoneCards = cards.filter((card) => !card.done);
		if (userState === "loggedIn") {
			await clearDoneCardsInDB(clearedDoneCards);
		} else {
			setLocalCards(clearedDoneCards);
		}
	}

	function selectCard(id) {
		setSelectedCardID(id);
	}

	function addCard(inputText, highPriorityDraft, dashTaskDraft) {
		if (userState === "loggedIn") {
			addCardToDB(inputText, highPriorityDraft, dashTaskDraft);
		} else {
			setLocalCards((prevCards) => {
				return [
					...prevCards,
					{
						id: maxLocalIndexKey + 1,
						text: inputText,
						done: false,
						renderKey: (maxLocalIndexKey + 1).toString(), //Always treat renderKey as a string, even if in guest mode it’s just the numeric id.”
						highPriority: highPriorityDraft,
						dashTask: dashTaskDraft,
						createdAt: new Date(),
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

	function updateCardById(id, patch) {
		if (userState === "guest") {
			// 👇 pass a function to setLocalCards; React calls it with the freshest array
			setLocalCards((prevCards) => {
				// prevCards is guaranteed current, even if multiple updates were queued
				const nextCards = prevCards.map((card) => {
					// For the matching card, merge in the patch (updated fields)
					if (card.id === id) {
						// Spread old card first, then patch so patch wins
						return { ...card, ...patch };
					}
					// Leave other cards untouched (keeps their referential identity)
					return card;
				});

				// Return the new array; React will render with this value
				return nextCards;
			});
		} else if (userState === "loggedIn") {
			// Logged-in path (Firestore): do your DB update
			// You can keep it non-optimistic:
			updateCardsInDB(id, patch);

			// Or do an optimistic local update too, then revert on error if you like:
			// setLocalCards(prev => prev.map(c => c.id === id ? ({...c, ...patch}) : c));
			// updateCardsInDB(id, patch).catch(() => setLocalCards(prev => /* revert */));
		}
	}

	// Original simpler function but it introduced issues with stale localcards in guest mode and cards being overwritten/wiped/reborn
	// function updateCardById(id, updatedFields) {
	// 	if (userState === "guest") {
	// 		const updatedCards = localCards.map((card) => {
	// 			return card.id === id ? { ...card, ...updatedFields } : card;
	// 		});
	// 		setLocalCards(updatedCards);
	// 	} else if (userState === "loggedIn") {
	// 		updateCardsInDB(id, updatedFields);
	// 	}
	// }

	function handleTextChange(id, updatedText, flagProps = {}) {
		updateCardById(id, { text: updatedText, ...flagProps });
	}

	function handleFlagToggleChange(id, flagName, currentFlagValue, currentText) {
		updateCardById(id, { [flagName]: !currentFlagValue, text: currentText });
	}

	function handleTipsHidden() {
		console.log("Tips toggle fired");
		setTipsHidden(!isTipsHidden);
	}
	const commonSwimlaneProps = {
		onDelete: deleteCard,
		onTextUpdate: handleTextChange,
		onSelect: selectCard,
		onFlagToggle: handleFlagToggleChange,
	};

	return (
		<div className="main-page-container">
			<div className="main">
				<div>
					<Header />
				</div>
				<div
					className={`dashboard-content ${
						editingLocked ? "dashboard-is-locked" : ""
					}`}
				>
					<div className="dashboard-top">
						<div className="band-inner">
							{!isTipsHidden && <Tips />}

							<section className="mini-dashboard-widgets widget">
								<div className="mini-dashboard-inner-panels">
									<Summary
										cardsTotal={cardsTotal}
										highPriorityCardsTotal={highPriorityCardsTotal}
										dashTaskCardsTotal={dashTaskCardsTotal}
										doneCardsTotal={doneCardsTotal}
									/>

									<Actions
										isTipsHidden={isTipsHidden}
										handleTipsHidden={handleTipsHidden}
										handleClearAllDoneTasks={handleClearAllDoneTasks}
										handleDeleteAll={handleDeleteAll}
										editingLockRefCurrent={editingLockRef.current}
										doneCardsTotal={doneCardsTotal}
										cardsTotal={cardsTotal}
									/>

									<DraftCard
										onAdd={addCard}
										isAdding={isAdding}
										disabled={editingLockRef.current}
									/>
								</div>
							</section>
						</div>
					</div>

					{cardsTotal > 0 && (
						<div className="dashboard-swimlanes">
							<div className="band-inner">
								<Swimlane
									title="High Priority Tasks"
									cards={highPriorityCards}
									hidden={highPriorityHidden}
									containerClass="cards-container"
									headingID="high-priority-section"
									{...commonSwimlaneProps}
								/>

								<Swimlane
									title="Dash Tasks"
									cards={dashTaskCards}
									hidden={dashTasksHidden}
									containerClass="cards-container"
									headingID="dash-tasks-section"
									{...commonSwimlaneProps}
								/>

								<Swimlane
									title="All Other Tasks"
									cards={allOtherCards}
									hidden={allOtherCardsHidden}
									containerClass="cards-container"
									headingID="all-other-tasks-section"
									{...commonSwimlaneProps}
								/>

								<Swimlane
									title="Done Tasks"
									cards={doneCards}
									hidden={doneCardsHidden}
									containerClass="cards-container"
									headingID="done-tasks-section"
									{...commonSwimlaneProps}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			<div>
				<Footer />
			</div>
			<ErrorDisplay />
		</div>
	);
};
export default Dashboard;
