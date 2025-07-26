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
import { useUI } from "./UIContext";
import Swimlane from "./Components/Swimlane";
import Summary from "./Components/Summary";
import SummaryStats from "./Components/SummaryStats";
import Tips from "./Components/Tips";
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
	const { user, userState } = useAuth();
	const { isEditingLock, editingLockRef } = useUI();

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

	useEffect(() => {
		// console.log("dbcards have changed");
	}, [dbCards]); // New Use Effect

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

	function updateCardById(id, updatedFields) {
		if (userState === "guest") {
			console.log("updated fields = ", updatedFields);
			const updatedCards = localCards.map((card) => {
				return card.id === id ? { ...card, ...updatedFields } : card;
			});
			console.log("updated cards= ", updatedCards);
			setLocalCards(updatedCards);
		} else if (userState === "loggedIn") {
			updateCardsInDB(id, updatedFields);
		}
	}

	function handleTextChange(id, updatedText, flagProps = {}) {
		console.log(
			"handle text change called in dashboard with flagProps = ",
			flagProps
		);
		updateCardById(id, { text: updatedText, ...flagProps });
	}

	function handleFlagToggleChange(id, flagName, currentFlagValue, currentText) {
		updateCardById(id, { [flagName]: !currentFlagValue, text: currentText });
	}
	const commonSwimlaneProps = {
		onDelete: deleteCard,
		onTextUpdate: handleTextChange,
		onSelect: selectCard,
		onFlagToggle: handleFlagToggleChange,
	};

	console.log("Dash Cards: ", dashTaskCards);

	return (
		<div className="main-page-container">
			<div className="main">
				<div>
					<Header />
				</div>
				<div
					className={`dashboard-content ${
						isEditingLock ? "dashboard-is-locked" : ""
					}`}
				>
					<div className="dashboard-top">
						<Tips />
						<Summary
							cardsTotal={cardsTotal}
							highPriorityCardsTotal={highPriorityCardsTotal}
							dashTaskCardsTotal={dashTaskCardsTotal}
							doneCardsTotal={doneCardsTotal}
						/>

						<div className="card-actions widget">
							<div className="card-actions-buttons">
								<h2 className="h2-heading">Actions</h2>
								<Tooltip title="Clear Done Tasks" placement="left">
									<IconButton
										className={doneCardsTotal === 0 ? "button-disabled" : ""}
										disabled={doneCardsTotal === 0 || editingLockRef.current}
										onClick={handleClearAllDoneTasks}
									>
										<PublishedWithChangesIcon
											fontSize="large"
											color="secondary"
										/>
									</IconButton>
								</Tooltip>

								<Tooltip title="Delete All Tasks" placement="right">
									<IconButton
										className={cardsTotal === 0 ? "button-disabled" : ""}
										disabled={cardsTotal === 0 || editingLockRef.current}
										onClick={handleDeleteAll}
									>
										<DeleteSweepIcon fontSize="large" color="secondary" />
									</IconButton>
								</Tooltip>
							</div>
						</div>

						<DraftCard
							onAdd={addCard}
							isAdding={isAdding}
							disabled={editingLockRef.current}
						/>
					</div>

					<div>
						<Swimlane
							title="High Priority Tasks"
							cards={highPriorityCards}
							hidden={highPriorityHidden}
							containerClass="high-priority-cards-container"
							headingID="high-priority-section"
							{...commonSwimlaneProps}
						/>

						<Swimlane
							title="Dash Tasks"
							cards={dashTaskCards}
							hidden={dashTasksHidden}
							containerClass="dash-tasks-cards-container"
							headingID="dash-tasks-section"
							{...commonSwimlaneProps}
						/>

						<Swimlane
							title="All Other Tasks"
							cards={allOtherCards}
							hidden={allOtherCardsHidden}
							containerClass="all-other-cards-container"
							headingID="all-other-tasks-section"
							{...commonSwimlaneProps}
						/>

						<Swimlane
							title="Done Tasks"
							cards={doneCards}
							hidden={doneCardsHidden}
							containerClass="done-cards-container"
							headingID="done-tasks-section"
							{...commonSwimlaneProps}
						/>
					</div>
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
