import React, {useState} from "react"
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


function DraftCard(props) {

    const [createCardText, setCreateCardText] = useState("");

    function handleChange(event) {
        console.log(event.target.value);
        setCreateCardText(event.target.value);      
    }
    
    function handleSubmit(event) {       
        event.preventDefault();
        setCreateCardText("");
        props.onAdd(createCardText);
    }

    return (<div id = "draft-card" className="card">
        <div className="cards-top"></div>
        <div><form><textarea maxLength = {50} onChange = {handleChange} name="cardtext" rows="3" cols="30" placeholder="Write new task here" value={createCardText}></textarea></form></div>
        <div className="draft-card-bottom">
            <Tooltip title="Add task" placement="left">
                <IconButton type="submit" onClick={handleSubmit}>
                    <NoteAddIcon  color="primary"/>
                </IconButton>
            </Tooltip>
        </div>        
    </div>);
};

export default DraftCard;