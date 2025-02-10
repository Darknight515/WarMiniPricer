import React, { useState, useEffect } from "react";
import { useMiniContext } from "../contexts/MiniContext";

function DisplayCard({ mini }) {
    const { isInCart, addMiniToCart, removeMiniToCart } = useMiniContext;
    return (
        <div className="
        rounded-md
        bg-slate-400
        max-w-60
        max-h-90
        min-h-90
        flex
        flex-col
        items-center
        justify-center
        p-4">
            <div className="card-image flex justify-center max-w-60 max-h-60">
                <img src={mini.image_url} alt="mini image" />
            </div>
            <div className="card-info text-center mt-2">{mini.name}</div>
            <div className="card-pricing">${mini.price}</div>
            <div className="card-buttons flex gap-2 mt-2">
                <input
                    type="button"
                    value="ding"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                />
                <input
                    type="button"
                    value="ling"
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                />
            </div>
        </div>
    )
}

export default DisplayCard;