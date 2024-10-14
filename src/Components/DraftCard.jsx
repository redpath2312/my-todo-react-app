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
        <form><textarea maxLength = {50} onChange = {handleChange} name="cardtext" rows="3" cols="30" placeholder="Write text here" value={createCardText}></textarea> 
        <button type="submit" onClick={handleSubmit}>Add</button></form>
    </div>);
};

export default DraftCard;