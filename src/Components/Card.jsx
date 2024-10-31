import React, {useState} from "react";

// If not hovered show card with props text.
// If hovered show card with a text area.
// Initially ensure when handleMouseEnter is called that cardText isupdated with props.text. Then if selected , the textarea component shows the local state of cardText allowing user to change it in the form.
// Call updateCard to update props when text is changed.

function Card(props) {


const [isHovered, setHovered] = useState(false);
const [cardText, setCardText] = useState("");

function handleTextChange(event) {
    const newText = event.target.value;
    setCardText(newText); 
    props.onUpdate(newText);
    // console.log(`Card Text = ${newText}`);

}
function handleMouseEnter (id){
    setHovered(true);
    setCardText(props.text);
  }
  
function handleMouseLeave (id){
    setHovered(false);
  }


    return (<div onMouseEnter={() => {handleMouseEnter(props.id)}} onMouseLeave={() => {handleMouseLeave(props.id)}} className= {`${isHovered? "card-hovered card " : "card"}`} >
                <div className= "cards-top">    
                    <div><p style={{textAlign: "left"}}>id: {props.id}</p></div>
                </div>
                <div className="cards-middle"> {isHovered? <form><textarea onSelect = {() => {props.onSelect(props.id)}} maxLength = {50} value ={cardText} onChange={handleTextChange}> </textarea></form> : <h2>{props.text}</h2>}</div>
        
                 <div className="cards-bottom">
                    <div><button onClick= {() => {props.onDelete(props.id)}}>Delete</button></div>
                    <div id="checkBox"><label>
                    <input 
                    type="checkbox" 
                    value = {props.checked} 
                    onChange={() => {props.onChange(props.id)}}
                    />Done</label></div>            
                </div>    
            </div>);
};

export default Card;