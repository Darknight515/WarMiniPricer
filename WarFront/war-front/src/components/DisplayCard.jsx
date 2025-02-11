import React, { useState, useEffect } from "react";
import { useMiniContext } from "../contexts/MiniContext";

function DisplayCard({ mini }) {
    const { isInCart, addMiniToCart, removeMiniToCart } = useMiniContext;

    // Use the latest_price if the property exists or the fallback 'current_price' property
    let displayPrice = "";
    // Check if there is a price change: previous_price exists and differs from new_price
    if (mini.previous_price && mini.previous_price !== mini.new_price) {
        displayPrice = `Was $${mini.previous_price}, Now $${mini.new_price}`;
    } else {
        // Otherwise, fallback to new_price, current_price, or mini.price
        displayPrice = `$${mini.new_price || mini.current_price || mini.price || 'N/A'}`;
    }
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
        p-4
        overflow-hidden">
            <div className="card-image flex justify-center max-w-60 max-h-60 overflow-hidden">
                <img src={mini.image_url} alt="mini image" />
            </div>
            <div className="card-info max-h-auto max-w-full overflow-hidden">
            <div className="text-center mt-2 truncate">{mini.name}</div>
            <div className="card-pricing overflow-hidden truncate">Price: ${displayPrice}</div>
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
        </div>
    )
}

export default DisplayCard;