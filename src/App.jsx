import React, { useState, useEffect } from 'react'
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import DraftCard from './Components/DraftCard'
import Card from './Components/Card'
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

function App() {

 // Implement a button to delete/clear all


  const [cards, setCards] = useState([]);
  const [maxIndexKey, setMaxIndexKey] = useState(0);
  const [selectedCardID, setSelectedCardID] = useState(null);

  const doneCards = cards.filter((card) => card.checked ==true)
  const doneCardsTotal = doneCards.length;
  const highPriorityCards = cards.filter((card) => card.highPriority ==true && !card.checked);
  const highPriorityCardsTotal = highPriorityCards.length;
  const allOtherCards = cards.filter((card) => card.highPriority ==false && !card.checked);
  const allOtherCardsTotal = allOtherCards.length;
  const [highPriorityHidden, setHighPriorityHidden] = useState(true);
  const [allOtherCardsHidden, setAllOtherCardsHidden] = useState(true);
  const [doneCardsHidden, setDoneCardsHidden] = useState(true);


  function handleDeleteAll() {
    setCards([]);
  }
  function handleClearAllDoneTasks() {
    setCards(cards.filter(card=> !card.checked));
  }

  function handleCheckedChanged(id) {
       setCards(cards.map((card) => {
      if (card.id === id){
        return {...card, checked: !card.checked};
      } else { 
        return card};
    }));    
  }

  function handlePriorityChanged(id) {
    setCards(cards.map((card) => {
      if (card.id ===id) {
        return {...card, highPriority: !card.highPriority};
        } else {return card};
        }))
 }     

  function selectCard(id) {
    setSelectedCardID(id);
    console.log(id);
  }

  function addCard(inputText) {
  setCards((prevCards)=> {
      return [...prevCards, {id: ((maxIndexKey)+1),
      text: inputText, checked: false, key: (maxIndexKey+1), highPriority:false}
      ];
  });
  setMaxIndexKey(maxIndexKey+1);
  }

  function deleteCard(id) {
  const newCardsList = cards.filter((card)=> card.key !=id);
  setCards(newCardsList);
  }

  // console.log(cards);


  useEffect(() => {
    checkDoneCardsDisplay();
    checkHighPriorityCardsDisplay();
    checkAllOtherCardsDisplay() 
  }, [cards]);

   function checkDoneCardsDisplay() {
  if (doneCardsTotal >0){
    setDoneCardsHidden(false);
  } else
  {
    setDoneCardsHidden(true);
  }
} 
  function checkHighPriorityCardsDisplay() {
    if (highPriorityCardsTotal >0){
      setHighPriorityHidden(false);
  } else {
      setHighPriorityHidden(true);
  }
}

function checkAllOtherCardsDisplay() {
  if (allOtherCardsTotal >0){
    setAllOtherCardsHidden(false);
} else {
    setAllOtherCardsHidden(true);
}
}
    
  function updateCard (updatedText) {
    setCards(cards.map((card) => {
      if (card.id === selectedCardID) {
        console.log("Found Selected ID");
        return {...card, text: updatedText};
      } else {
          return card};
        }));
    }
  
  return ( 
    <div>   
      <div className="main">
        <div>
          <Header />
        </div>
        <div className="summary">
        <div id="summary-heading"><h2>Summary</h2></div>
        <h3> You Have:</h3>
        <p>{cards.length} Total Tasks</p>
        <p>{highPriorityCardsTotal} High Priority Tasks</p>
        <p>{doneCardsTotal} Tasks Done</p>

        <div>
        <Tooltip title="Clear Done Tasks" placement="left">
        <IconButton onClick={handleClearAllDoneTasks}>
        <PublishedWithChangesIcon  fontSize="large" color="primary"/>
        </IconButton>
        </Tooltip>  

        <Tooltip title="Delete All Tasks" placement="right">
        <IconButton onClick={handleDeleteAll}>
        <DeleteSweepIcon  fontSize="large" color="primary"/>
        </IconButton>
        </Tooltip>
        </div>       
        </div>
          <div className = "draft-card-container">
            <DraftCard 
            onAdd = {addCard}/>
          </div>
          <div className="swimlane-heading" id="high-priority-heading">
          {!highPriorityHidden && (
          <h3>High Priority</h3>)}
          </div>
        <div className= "high-priority-cards-container">
          {highPriorityCards.map((card) => (
             <Card
             key = {card.id}
             id = {card.id}
             text = {card.text}
             checked = {card.checked}
             highPriority = {card.highPriority}
             onCheckedChange = {handleCheckedChanged}
             onPriorityChange = {handlePriorityChanged}
             onDelete = {deleteCard}
             onUpdate = {updateCard} 
             onSelect = {selectCard}
             />          
           ))}        
        </div>
        <div className="swimlane-heading" id="all-other-tasks-heading">
        {!allOtherCardsHidden && (
        <h3>All Other Tasks</h3>)}
        </div>
        <div className='cards-container'>
          {allOtherCards.map((card)=> (
          <Card
          key = {card.id}
          id = {card.id}
          text = {card.text}
          checked = {card.checked}
          highPriority = {card.highPriority}
          onCheckedChange = {handleCheckedChanged}
          onPriorityChange = {handlePriorityChanged}
          onDelete = {deleteCard}
          onUpdate = {updateCard} 
          onSelect = {selectCard}
          />          
        ))}
        </div>
        <div className="swimlane-heading" id="done-tasks-heading">
        {!doneCardsHidden && (
        <h3>Tasks Done</h3>
        )}
        </div>

        <div className='done-cards-container'>          
          {doneCards.map((card)=> (
          <Card
          key = {card.id}
          id = {card.id}
          text = {card.text}
          checked = {card.checked}
          highPriority = {card.highPriority}
          onCheckedChange = {handleCheckedChanged}
          onPriorityChange = {handlePriorityChanged}
          onDelete = {deleteCard}
          onUpdate = {updateCard} 
          onSelect = {selectCard}
          />          
        ))}
        </div>
      </div>

      <div>
        <Footer />
      </div>

    </div>    
  )
};

export default App;
