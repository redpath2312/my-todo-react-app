import React, {useState} from "react"
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider } from "@mui/material/styles";


function DraftCard(props) {

    const [createCardText, setCreateCardText] = useState("");

    function handleChange(event) {
        setCreateCardText(event.target.value);      
    }
    
    function handleSubmit(event) {       
        event.preventDefault();
        setCreateCardText("");
        props.onAdd(createCardText);
    }

    let theme = createTheme({
        palette: {
          create: {
            main: '#c7a67b',
          },
        },
      });

    return (<div id = "draft-card" className="card">
        <div className="cards-top"></div>
        <div><form><textarea maxLength = {30} onChange = {handleChange} name="cardtext" rows="2" cols="30" placeholder="Write new task here" value={createCardText}></textarea></form></div>
        <div className="draft-card-bottom">
            <ThemeProvider theme={theme}>
            <Tooltip title="Add task" placement="left">
                <IconButton type="submit" onClick={handleSubmit}>
                    <NoteAddIcon  color="create"/>
                </IconButton>
            </Tooltip>
            </ThemeProvider>
        </div>        
    </div>);
};

export default DraftCard;