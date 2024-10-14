import React from "react"

function Card(props) {
    return (<div className="card">
        <div><p style={{textAlign: "left"}}>id: {props.id}</p>  </div>
        <div><h2>{props.text}</h2></div>
        <div id="checkBox"><label><input type="checkbox" value = {props.checked} 
        onChange={() => {props.onChange(props.id);
        }} 
        />Done</label></div>     
        <div><button onClick= {() => {props.onDelete(props.id)}}>Delete</button></div>    
        </div>)
}

export default Card;