import React, {useState} from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';

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


    return (<div onMouseEnter={() => {handleMouseEnter(props.id)}} onMouseLeave={() => {handleMouseLeave(props.id)}} className= {`${isHovered? "card-hovered card " : "card"}`} >
                <div className= "cards-top">    
                    <div id="card-id-display" ><p style={{textAlign: "left"}}>id: {props.id}</p></div>
                </div>
                <div className="cards-middle"> {isHovered? <form><textarea onSelect = {() => {props.onSelect(props.id)}} maxLength = {30} value ={cardText} onChange={handleTextChange}> </textarea></form> : <h2 id= "card-text">{props.text}</h2>}</div>
        
                 <div className="cards-bottom"><ThemeProvider theme={theme}>
                    <div> 
                      <Tooltip title="Delete" placement="right">
                           <IconButton onClick={() => {props.onDelete(props.id)}}>
                              <DeleteForeverIcon  fontSize="large" color="secondary"/>
                           </IconButton>
                           </Tooltip>                                        
                    </div>
                    <div>  <Tooltip title="Toggle High Priority" placement="bottom">
                           <IconButton onClick={() => {props.onPriorityChange(props.id)}}>
                              <PriorityHighIcon  value= {props.highPriority} fontSize="large" color={`${props.highPriority? "secondary" : "disabled"}`}/>
                           </IconButton>
                           </Tooltip>  

                    </div>
                    <div>  <Tooltip title="Toggle Done" placement="left-start">
                            <IconButton onClick={() => {props.onCheckedChange(props.id)}}>
                            <CheckCircleIcon value = {props.checked} 
                             color={`${props.checked? "success" : "disabled"}`} fontSize={`${props.checked? "large" : "medium"}`} />
                            </IconButton>
                         </Tooltip>
    
                   </div></ThemeProvider>
                </div>    
            </div>);
};

export default Card;