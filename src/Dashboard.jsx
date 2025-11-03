import { useState, useEffect, useMemo } from "react";
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
import ConfirmDialog from "./Components/ConfirmDialog";
import AppMeta from "./Components/AppMeta";
import React from "react";
import { devDebug, info } from "./utils/logger";
import TasksSkeleton from "./Components/TasksSkeleton";
const Dashboard = ({
	dbCards,
	addCardToDB,
	updateCardsInDB,
	deleteCardInDB,
	clearDoneCardsInDB,
	deleteAllCardsInDB,
	isAdding,
	cardsReady,
}) => {
	const [localCards, setLocalCards] = useState([]);
	const { userState } = useAuth();
	const { editingLocked, editingLockRef } = useUI();
	const [isTipsHidden, setTipsHidden] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const showSkeleton = userState === "loggedIn" && cardsReady === false;
	// for easy testing
	// const showSkeleton = true;
	React.useEffect(() => {
		if (!import.meta.env.DEV || !("PerformanceObserver" in window)) return;

		const po = new PerformanceObserver((list) => {
			for (const entry of list.getEntries()) {
				// `entry.element` is the LCP node (may be null)
				const el = /** @type {HTMLElement|null} */ (entry.element || null);
				info(
					"[LCP]",
					Math.round(entry.startTime),
					"ms",
					el ? `${el.tagName}${el.id ? "#" + el.id : ""}` : "(no element)"
				);
				if (el) el.style.outline = "2px dashed orange"; // visual marker
			}
		});

		try {
			po.observe({ type: "largest-contentful-paint", buffered: true });
		} catch {
			/* ignore */
		}

		return () => po.disconnect();
	}, []);

	/* 1) Memoize the source list once */
	const cards = useMemo(() => {
		return userState === "loggedIn"
			? dbCards
			: userState === "guest"
			? localCards
			: [];
	}, [userState, dbCards, localCards]); // ✅ true deps, linter happy
	const [maxLocalIndexKey, setMaxLocalIndexKey] = useState(0);

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
		allOtherCardsTotal,
		hpDashTotal,
		hpOnlyTotal,
	} = useMemo(() => {
		const list = cards;
		const doneCards = list.filter((c) => c.done);
		const highPriorityCards = list.filter((c) => c.highPriority && !c.done);
		const dashTaskCards = list.filter(
			(c) => c.dashTask && !c.highPriority && !c.done
		);
		const allOtherCards = list.filter(
			(c) => !c.highPriority && !c.dashTask && !c.done
		);

		// accumulating on every card "c" a count "n" if hp or dash but not done to get total.
		const hpDashTotal = list.reduce(
			(n, c) => n + (c.highPriority && c.dashTask && !c.done ? 1 : 0),
			0
		);

		const hpOnlyTotal = list.reduce(
			(n, c) => n + (c.highPriority && !c.dashTask && !c.done ? 1 : 0),
			0
		);

		return {
			cardsTotal: list.length,

			doneCards,
			doneCardsTotal: doneCards.length,
			doneCardsHidden: doneCards.length === 0,

			highPriorityCards,
			highPriorityCardsTotal: highPriorityCards.length,
			highPriorityHidden: highPriorityCards.length === 0,

			dashTaskCards,
			dashTaskCardsTotal: dashTaskCards.length,
			dashTasksHidden: dashTaskCards.length === 0,

			allOtherCards,
			allOtherCardsTotal: allOtherCards.length,
			allOtherCardsHidden: allOtherCards.length === 0,

			hpDashTotal,
			hpOnlyTotal,
		};
	}, [cards]);

	useEffect(() => {}, [dbCards]); // New Use Effect

	async function handleDeleteAll() {
		if (editingLockRef === true) return;
		setConfirmOpen(true);
	}

	async function confirmDeleteAll() {
		setConfirmOpen(false);
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
			return updateCardsInDB(id, patch); //must return

			// Or do an optimistic local update too, then revert on error if you like:
			// setLocalCards(prev => prev.map(c => c.id === id ? ({...c, ...patch}) : c));
			// updateCardsInDB(id, patch).catch(() => setLocalCards(prev => /* revert */));
		}
	}

	function handleTextChange(id, updatedText) {
		return updateCardById(id, { text: updatedText });
	}

	function handleFlagToggleChange(id, flagName, currentFlagValue) {
		return updateCardById(id, { [flagName]: !currentFlagValue });
	}

	function handleTipsHidden() {
		setTipsHidden(!isTipsHidden);
	}
	const commonSwimlaneProps = {
		onDelete: deleteCard,
		onTextUpdate: handleTextChange,
		onFlagToggle: handleFlagToggleChange,
	};

	devDebug("Show Skeleton: ", showSkeleton);
	devDebug("Cards Ready (Dashboard): ", cardsReady);
	return (
		<>
			<AppMeta
				baseTitle={
					userState === "guest"
						? "DashTasker - Guest"
						: "DashTasker - Dashboard"
				}
				baseDescription={
					userState === "guest"
						? "Explore DashTasker in guest mode—no account needed."
						: "Your prioritized task board for creating and dashing through tasks."
				}
			/>
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
											allOtherCardsTotal={allOtherCardsTotal}
											hpDashTotal={hpDashTotal}
											hpOnlyTotal={hpOnlyTotal}
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

						{/* === YOUR TASKS SECTION (new wrapper always present) === */}
						<section className="dashboard-bottom">
							<div className="band-inner">
								<h2 className="h2-heading">Your Tasks</h2>
								{showSkeleton ? (
									<TasksSkeleton heightClass="h-28 md:h-32" />
								) : (cardsReady === true || userState === "guest") &&
								  cardsTotal > 0 ? (
									<div className="dashboard-swimlanes">
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
								) : (cardsReady === true || userState === "guest") &&
								  cardsTotal === 0 ? (
									<div className="widget flex items-center justify-center min-h-[140px]">
										<p>
											No tasks yet - Create in panel above to start managing
											them here
										</p>
									</div>
								) : null}
							</div>
						</section>
					</div>
				</div>

				<div>
					<Footer />
				</div>
				<ErrorDisplay />
				<ConfirmDialog
					open={confirmOpen}
					title="Delete all cards?"
					description="This will permanently remove every card in your dashboard. This cannot be undone."
					confirmText="Delete all"
					cancelText="Cancel"
					tone="danger"
					onConfirm={confirmDeleteAll}
					onCancel={() => setConfirmOpen(false)}
				/>
			</div>
		</>
	);
};
export default Dashboard;
