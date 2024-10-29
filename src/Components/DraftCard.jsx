import React, {useState} from "react"

function DraftCard(props) {
    // Have just the one useState 
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
        <div><form><textarea maxLength = {50} onChange = {handleChange} name="cardtext" rows="3" cols="30" placeholder="Write new task here" value={createCardText}></textarea></form></div>
        <div className="draft-card-bottom"><button type="submit" onClick={handleSubmit}>Add</button></div>        
    </div>);
};

export default DraftCard;