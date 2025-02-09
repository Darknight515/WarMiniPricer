import React, {useState, useEffect} from "react";
import {ScaleIcon} from "@heroicons/react/24/outline"
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

function CategoryNav({onCategorySelect}) {

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
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error loading categories.</div>;
  }

    return(
    <nav className="w-64 bg-gray-100 p-4">
      <ul className="space-y-2 overflow-y-scroll max-h-screen">
        <li>
          <button
            onClick={() => onCategorySelect(null)}
            className="flex items-center p-2 rounded hover:bg-gray-200 w-full text-left"
          >
            <ScaleIcon className="w-5 h-5 mr-2" />
            <span>All</span>
          </button>
        </li>
        {categories.map((category, index) => (
          <li key={index}>
            <button
              onClick={() => onCategorySelect(category)}
              className="flex items-center p-2 rounded hover:bg-gray-200 w-full text-left"
            >
              <ScaleIcon className="w-5 h-5 mr-2" />
              <span>{normalizeCategory(category)}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
    )
}

export default CategoryNav;