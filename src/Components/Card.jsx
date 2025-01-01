import React, {useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

// If not hovered show card with props text.
// If hovered show card with a text area.
// Initially ensure when handleMouseEnter is called that cardText isupdated with text (from props). Then if selected , the textarea component shows the local state of cardText allowing user to change it in the form.
// Call updateCard to update props when text is changed.

function Card({ id, text, checked, highPriority, onCheckedChange, onPriorityChange, onDelete, onUpdate, onSelect }) {


const [isHovered, setHovered] = useState(false);
const [cardText, setCardText] = useState("");

function handleTextChange(event) {
    const newText = event.target.value;
    setCardText(newText); 
    onUpdate(newText);
}
function handleMouseEnter (){
    setHovered(true);
    setCardText(text);
  }
  
function handleMouseLeave (){
    setHovered(false);
  }

 let theme = createTheme({
    palette: {
      primary: {
        main: '#bdac80',
      },
      secondary: {
        main: '#E98074'
      },
    },
  });

  function cardClassCheck(checked, highPriority, isHovered) {
    if (checked) return "card card-done";               // Green for done cards
    if (highPriority) return "card card-high-priority";  // Red for high-priority cards
    if (isHovered) return "card card-hovered";           // Yellow for hovered cards
    return "card";                                  // Blue for other tasks
  }   

return (<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className= {cardClassCheck(checked, highPriority, isHovered)}>
                <div className= "cards-top">    
                    <div id="card-id-display" ><p style={{textAlign: "left"}}>id: {id}</p></div>
                </div>
                <div className="cards-middle"> {isHovered? <form><textarea onSelect = {() => {onSelect(id)}} maxLength = {30} value ={cardText} onChange={handleTextChange}> </textarea></form> : <h2 id= "card-text">{text}</h2>}</div>
        
                 <div className="cards-bottom"><ThemeProvider theme={theme}>
                    <div> 
                      <Tooltip title="Delete" placement="right">
                           <IconButton onClick={() => {onDelete(id)}}>
                              <DeleteForeverIcon  fontSize="large" color="secondary"/>
                           </IconButton>
                           </Tooltip>                                        
                    </div>
                    <div>  <Tooltip title="Toggle High Priority" placement="bottom">
                           <IconButton onClick={() => {onPriorityChange(id)}}>
                              <PriorityHighIcon  value= {highPriority} fontSize="large" color={`${highPriority? "secondary" : "disabled"}`}/>
                           </IconButton>
                           </Tooltip>  

                    </div>
                    <div>  <Tooltip title="Toggle Done" placement="left-start">
                            <IconButton onClick={() => {onCheckedChange(id)}}>
                            <CheckCircleIcon value = {checked} 
                             color={`${checked? "success" : "disabled"}`} fontSize={`${checked? "large" : "medium"}`} />
                            </IconButton>
                         </Tooltip>
    
                   </div></ThemeProvider>
                </div>    
            </div>);
};

export default Card;