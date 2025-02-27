import React, { useState, useEffect } from "react";
import { ScaleIcon } from "@heroicons/react/24/outline"
import { getMiniDataList } from "../services/api";

function normalizeCategory(category) {
  // Split the category on hyphens
  const tokens = category.split("-");
  // Remove tokens that you don't want to display
  const unwanted = ["gw40k", "gw", "cp"];
  const filtered = tokens.filter(token => !unwanted.includes(token));
  // Join the remaining tokens with spaces and change to all uppercase
  return filtered.join(" ").toUpperCase();
}

function CategoryNav({ onCategorySelect, selectedCategory }) {

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getMiniDataList();
        // Assuming each mini has a "faction" field representing its category
        const minis = data.mini_data_list || [];
        const uniqueCategories = [...new Set(minis.map((mini) => mini.faction))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching mini data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return <div className="text-[var(--color-neon-green)]">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-[var(--color-neon-green)]">Error loading categories.</div>;
  }

  return (
    <nav className="w-64 p-4 border-r h-full">
      <h2 className="text-2xl pb-4">Warhammer 40K Factions</h2>
      <ul
        className="space-y-2 overflow-y-auto h-full pr-2 pb-4 scrollbar-thin scrollbar-thumb-[var(--color-imperial-gold)] scrollbar-track-[var(--color-dark-grey)]"
        style={{ scrollbarGutter: "stable" }}
      >
        <li>
          <button
            onClick={() => onCategorySelect(null)}
            className={`flex items-center p-2 rounded hover:bg-[var(--color-neon-green)] w-full text-left transition-colors duration-200 ease-in-out
              ${selectedCategory === null ? 'bg-[var(--color-imperial-gold)] text-[var(--color-dark-grey)]' : 'hover:bg-[var(--color-neon-green)]'}`}
          >
            {/* <ScaleIcon className="w-5 h-5 mr-2 text-[var(--color-off-white)]" /> */}
            <span>All</span>
          </button>
        </li>
        {categories.map((category, index) => (
          <li key={index}>
            <button
              onClick={() => onCategorySelect(category)}
              className={`
                flex items-center p-2 rounded w-full text-left transition-colors duration-200 ease-in-out
                ${selectedCategory === category ? 'bg-[var(--color-imperial-gold)] text-[var(--color-dark-grey)]' : 'hover:bg-[var(--color-neon-green)]'}
              `}
            >
              {/* <ScaleIcon className="w-5 h-5 mr-2 text-[var(--color-off-white)]" /> */}
              <span>{normalizeCategory(category)}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default CategoryNav;