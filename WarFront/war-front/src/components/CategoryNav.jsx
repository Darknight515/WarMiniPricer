import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMiniDataList } from "../services/api";

function normalizeCategory(category) {
  const tokens = category.split("-");
  const unwanted = ["gw40k", "gw", "cp"];
  const filtered = tokens.filter((token) => !unwanted.includes(token));
  return filtered.join(" ").toUpperCase();
}

function CategoryNav({ onCategorySelect, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getMiniDataList();
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

  const handleCategoryClick = (category) => {
    onCategorySelect(category); // Update the selected category
    navigate("/", { state: { category } }); // Navigate to the home view with the selected category
  };

  return (
    <nav className="w-64 p-4 border-r h-full bg-[var(--color-dark-grey)] text-[var(--color-off-white)] overflow-y-auto">
      <h2 className="text-2xl pb-4">Warhammer 40K Factions</h2>
      <ul className="space-y-2 h-full pr-2 pb-4 scrollbar-thin scrollbar-thumb-[var(--color-imperial-gold)] scrollbar-track-[var(--color-dark-grey)]">
        <li>
          <button
            onClick={() => handleCategoryClick(null)}
            className={`flex items-center p-2 rounded hover:bg-[var(--color-neon-green)] w-full text-left transition-colors duration-200 ease-in-out
              ${selectedCategory === null ? 'bg-[var(--color-imperial-gold)] text-[var(--color-dark-grey)]' : ''}`}
          >
            <span>All</span>
          </button>
        </li>
        {categories.map((category, index) => (
          <li key={index}>
            <button
              onClick={() => handleCategoryClick(category)}
              className={`flex items-center p-2 rounded w-full text-left transition-colors duration-200 ease-in-out
                ${selectedCategory === category ? 'bg-[var(--color-imperial-gold)] text-[var(--color-dark-grey)]' : ''}`}
            >
              <span>{normalizeCategory(category)}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default CategoryNav;