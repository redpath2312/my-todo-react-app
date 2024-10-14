import React from "react";

function Header(){
const name = "Pete";
    return (<header><h1><img className="header-icon" src= "/check-list-icon_128.svg" alt= "List Logo"/> {name}'s To Do List</h1> </header>);    
};

export default Header;