import React, { useState, useEffect } from "react";
import { useMiniContext } from "../contexts/MiniContext";
import { ShoppingCartIcon, PencilSquareIcon } from "@heroicons/react/16/solid"

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
      bg-[var(--color-dark-grey)]
      border border-[var(--color-imperial-gold)]
      max-w-120
      max-h-100
      min-h-90
      flex
      flex-col
      items-center
      justify-center
      p-4
      overflow-hidden
      text-[var(--color-off-white)]
      hover:bg-[var(--color-dark-grey)] 
      transition-colors">
            <div className="card-image flex justify-center max-w-60 max-h-60 overflow-hidden">
                <img src={mini.image_url} alt="mini image" className="rounded-md" />
            </div>
            <div className="card-info max-h-auto max-w-full overflow-hidden">
                <div className="text-center mt-2 truncate font-medium">{mini.name}</div>
                <div className="card-pricing overflow-hidden truncate text-[var(--color-imperial-gold)] flex justify-center items-center">
                    Price: {displayPrice}
                </div>
                <div className="card-buttons flex gap-2 mt-2 justify-center items-center">
                    <button
                        type="button"
                        className="px-4 py-2 bg-[var(--color-imperial-gold)] hover:bg-[var(--color-neon-green)] text-[var(--color-dark-grey)] rounded transition-colors duration-200">
                        <ShoppingCartIcon className="w-8 h-8 rounded bg-[var(--color-imperial-gold)] p-2 hover:bg-[var(--color-neon-green)] transition-colors" />
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-[var(--color-imperial-gold)] hover:bg-[var(--color-neon-green)] text-[var(--color-dark-grey)] rounded transition-colors duration-200">
                        <PencilSquareIcon className="w-8 h-8 rounded bg-[var(--color-imperial-gold)] p-2 hover:bg-[var(--color-neon-green)] transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DisplayCard;