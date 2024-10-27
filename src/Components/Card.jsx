import React, {useState} from "react";



//If not hovered show card with props text
//If hovered show card with a text area
//value will initially be props.text, but then if selected , don't show props but show target value.
// call update card to update props when click off or enter.
//enter text it needs to be event.target.value which needs to update back to the props.id

//could set initial text from props, but then go off cardText once selected.

function Card(props) {


const [isHovered, setHovered] = useState(false);

const [cardHighlightStyle, setCardHighlightStyle] = useState({background: "white"});

const [cardText, setCardText] = useState("");

// const [selectedCardID, setSelectedCardID] = useState();

// function handleSelect(id){
//     const newSelectedID = id;
//     // setSelectedCardID(newSelectedID);
//     // console.log(newSelectedID);
//     props.onSelect(newSelectedID);

// }

function handleTextChange(event) {
    const newText = (event.target.value);
    setCardText(newText); 
    props.onUpdate(newText);
    console.log(`Card Text = ${newText}`);

}
function handleMouseEnter (id){
    console.log(`MouseOver on ${id}`);
    setHovered(true);
    setCardHighlightStyle({background: "#dbd9d0", border: "4px solid #ffe485"});
    setCardText(props.text);
  }

  
function handleMouseLeave (id){
    console.log(`MouseOver on ${id}`);
    setHovered(false);
    setCardHighlightStyle({background: "white"});
  }

  

    return (<div style = {cardHighlightStyle} onMouseEnter={()=> {handleMouseEnter(props.id)}} onMouseLeave={() => {handleMouseLeave(props.id)}} className="card">
        <div>
        <div><p style={{textAlign: "left"}}>id: {props.id}</p>  </div>
      
        <div className="cards-middle"> {isHovered ===true? <form><textarea onSelect = {() => {props.onSelect(props.id)}} maxLength = {50} value ={cardText} onChange={handleTextChange}> </textarea></form> : <h2>{props.text}</h2>}</div>
        
        </div>
        <div className="cards-bottom">
        <div><button onClick= {() => {props.onDelete(props.id)}}>Delete</button></div>
        <div id="checkBox"><label><input type="checkbox" value = {props.checked} 
        onChange={() => {props.onChange(props.id)}}
        />Done</label></div>     
       
        </div>    
        </div>)
}

export default Card;