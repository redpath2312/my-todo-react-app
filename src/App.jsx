import React, { useState } from 'react'
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import DraftCard from './Components/DraftCard'
import Card from './Components/Card'


function App() {

  const [cards, setCards] = useState([]);
  const [maxIndexKey, setMaxIndexKey] = useState(0);

  const [selectedCardID, setSelectedCardID] = useState(0);



  
  const doneCardsTotal = cards.filter((card) => card.checked ==true).length;


  function handleCheckedChanged(id) {
       setCards(cards.map((card) => {
      if (card.id === id){
        return {...card, checked: !card.checked};
      } else { 
        return card};
    }));    
  }

  function selectCard(id) {
    setSelectedCardID(id);
    console.log(id);
  }

  function addCard(inputText) {
  setCards((prevCards)=> {
      return [...prevCards, {id: ((maxIndexKey)+1),
      text: inputText, checked: false, key: (maxIndexKey+1)}
      ];
  });
  setMaxIndexKey(maxIndexKey+1);
  }

  function deleteCard(id) {
  const newCardsList = cards.filter((card)=> card.key !=id);
  setCards(newCardsList);
  }

  console.log(cards);
  
  function checkDoneCards () {
    const doneCards = cards.filter((card) => card.checked ==true);
    console.log(`You have ${doneCards.length} tasks done so far`); // Shows but dont know how to concatenate in console.log
  }  

  function updateCard (updatedText) {
    console.log(`updated Card with ${updatedText}`);
    console.log(`selected card whilst in update card method = ${selectedCardID}`);
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
      
        <div>
        <Header />
        </div>
        <div>
        <p>You have {doneCardsTotal} tasks done so far</p>
        <DraftCard 
        onAdd = {addCard}/>
        </div>      
      <div className='container'>
        {cards.map((card)=> (
          <Card
          key = {card.id}
          id = {card.id}
          text = {card.text}
          checked = {card.checked}
          onChange = {handleCheckedChanged}
          onDelete = {deleteCard}
          onUpdate = {updateCard} 
          onSelect = {selectCard}
          />          
        ))}
      </div>
      <div>
        <Footer />
      </div>

    </div>    
  )
};

export default App;
