import React, {useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {red} from '@mui/material/colors'

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
                    <div> <Tooltip title="Delete" placement="right">
                           <IconButton onClick={() => {props.onDelete(props.id)}}>
                           <DeleteForeverIcon  fontSize="large"  sx={{color : red[500] }}/>
                           </IconButton>
                           </Tooltip>
                      
                    </div>
                    <div> <Tooltip title="Toggle Done" placement="left-start">
                            <IconButton onClick={() => {props.onChange(props.id)}}>
                            <CheckCircleIcon value = {props.checked} 
                             color={`${props.checked? "success" : "action"}`} fontSize={`${props.checked? "large" : "medium"}`} />
                            </IconButton>
                         </Tooltip> </div>
                </div>    
            </div>);
};

export default Card;