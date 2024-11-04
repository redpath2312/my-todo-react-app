import React, { useState } from 'react'
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import DraftCard from './Components/DraftCard'
import Card from './Components/Card'


function App() {

 // To Sort


  const [cards, setCards] = useState([]);
  const [maxIndexKey, setMaxIndexKey] = useState(0);
  const [selectedCardID, setSelectedCardID] = useState(null);

  const doneCards = cards.filter((card) => card.checked ==true)
  const doneCardsTotal = doneCards.length;
  const highPriorityCards = cards.filter((card) => card.highPriority ==true && !card.checked);
  const highPriorityCardsTotal = highPriorityCards.length;
  const allOtherCards = cards.filter((card) => card.highPriority ==false && !card.checked);

  //make swimlane hidden if no tasks
  
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

  console.log(cards);
  console.log(cards.filter((card) => card.highPriority ==true));
  
  //Function not called or needed
  function checkDoneCards () {
    const doneCards = cards.filter((card) => card.checked ==true);
    console.log(`You have ${doneCards.length} tasks done so far`); // Shows but dont know how to concatenate in console.log
  }  

  // function checkHighPriorityCards () {
  //   const highPriorityCardsTotal = cards.filter((card) => card.highPriority ==true);
  //   console.log(`You have ${highPriorityCardsTotal.length} High Priority Tasks`); // Shows but dont know how to concatenate in console.log
  // }  

  function updateCard (updatedText) {
    // console.log(`updated Card with ${updatedText}`);
    // console.log(`selected card whilst in update card method = ${selectedCardID}`);
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
        <h2>Summary</h2>
        <h3> You Have:</h3>
        <p>{cards.length} Total Tasks</p>
        <p>{highPriorityCardsTotal} High Priority Tasks</p>
        <p>{doneCardsTotal} Tasks Done</p>
        </div>
          <div className = "draft-card-container">
            <DraftCard 
            onAdd = {addCard}/>
          </div>
          <h3>High Priority</h3>
        <div className= 'high-priority-cards-container'>
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
        <h3>All Other Tasks</h3>
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
        <h3>Tasks Done</h3>
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
