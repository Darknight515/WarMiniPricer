import React, {useState, useEffect} from "react";
import { useMiniContext } from "../contexts/MiniContext";

function DisplayCard({mini}){
    const {isInCart, addMiniToCart, removeMiniToCart} = useMiniContext;
    return(
        <div className="rounded-md">
            <div className="card-image"></div>
            <div className="card-info">{mini.name}</div>
            <div className="card-pricing"></div>
        </div>
    )
}

export default DisplayCard;