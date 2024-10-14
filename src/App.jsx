import React, { useState } from 'react'
import Header from "./Components/Header"
import Footer from "./Components/Footer"
import DraftCard from './Components/DraftCard'
import Card from './Components/Card'



function App() {

  const [cards, setCards] = useState([]);
  // const [doneCardsTotal, setDoneCardsTotal] = useState(0);
  const [maxIndexKey, setMaxIndexKey] = useState(0);
  
  const doneCardsTotal = cards.filter((card) => card.checked ==true).length;


  function handleCheckedChanged(id) {
    setCards(cards.map((card) => {
      if (card.id === id){
        return {...card, checked: !card.checked};
      } else { 
        return card};
    }));    
  }


  // function handleCheckedChanged(id){
  //   setCards(({cards})=> ({

  //   }))
  
  // }
 
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
  // console.log(newCardsList);
  setCards(newCardsList);
  }

  console.log(cards);
  
  function checkDoneCards () {
    const doneCards = cards.filter((card) => card.checked ==true);
    console.log(`You have ${doneCards.length} tasks done so far`); // Shows but dont know how to concatenate in console.log
    // console.log(doneCards);
    // setDoneCardsTotal(doneCards.length);
  }  


  return ( 
    <div>   
      
        <div>
        <Header />
        </div>
        <div>
        <p>You have {doneCardsTotal} tasks done so far</p>
        <button onClick={checkDoneCards}>Check Done Cards</button>
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
          onDelete = {deleteCard} />          
        ))}
      </div>
      <div>
        <Footer />
      </div>

    </div>    
  )
};

export default App
