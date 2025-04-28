import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMiniDataList } from "../services/api";
import DisplayCard from "../components/DisplayCard";

function Home() {
  const [minis, setMinis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const location = useLocation();

  useEffect(() => {
    async function fetchMinis() {
      try {
        const data = await getMiniDataList();
        setMinis(data.mini_data_list);
      } catch (error) {
        console.error("Error fetching mini data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMinis();
  }, []);

  // Update the filter category if it comes from navigation state
  useEffect(() => {
    setFilterCategory(location.state?.category || null);
    setCurrentPage(1); // Reset to the first page
  }, [location.state]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--color-neon-green)]">
        <h1>Loading Minis...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-[var(--color-off-white)]">
        <h1>Error loading minis</h1>
      </div>
    );
  }

  // Filter minis by the selected category (if any)
  const filteredMinis = filterCategory
    ? minis.filter((mini) => mini.faction === filterCategory)
    : minis;

  // Calculate pagination
  const indexOfLastMini = currentPage * pageSize;
  const indexOfFirstMini = indexOfLastMini - pageSize;
  const currentMinis = filteredMinis.slice(indexOfFirstMini, indexOfLastMini);
  const totalPages = Math.ceil(filteredMinis.length / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Home header */}
      <header className="p-8 flex border-b-2 mb-2 ml-2">
        <h1 className="text-2xl font-stretch-semi-condensed font-bold text-[var(--color-neon-green)]">
          40K Accessories & Minis
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 ml-4 p-4 overflow-y-auto">
        <div className="grid grid-cols-6 gap-4">
          {currentMinis.map((mini) => (
            <Link to={`/mini/${mini.id}`} key={mini.id}>
              <DisplayCard mini={mini} />
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-4 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[var(--color-imperial-gold)] hover:bg-[var(--color-neon-green)] text-[var(--color-dark-grey)] rounded disabled:opacity-50 transition-colors duration-200"
          >
            Prev
          </button>
          <span className="text-[var(--color-imperial-gold)]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[var(--color-imperial-gold)] hover:bg-[var(--color-neon-green)] text-[var(--color-dark-grey)] rounded disabled:opacity-50 transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default Home;