import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom";
import { getMiniDataList } from "../services/api"
import CategoryNav from "../components/CategoryNav";
import DisplayCard from "../components/DisplayCard";

function Home() {
  const [minis, setMinis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12; // Number of cards per page

  useEffect(() => {
    async function fetchMinis() {
      try {
        const data = await getMiniDataList();
        // Expecting data in the format: {mini_data_list: [...]}
        setMinis(data.mini_data_list);
      } catch (error) {
        console.log('Error fetching mini data: ', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMinis();
  }, []);

  if(loading){
    return(
      <div className="h-screen flex items-center justify-center">
        <h1>Loading Minis...</h1>
      </div>
    );
  }

  if(error){
    return(
      <div className="h-screen flex items-center justify-center">
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
    if(newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Home header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold">Mini Data List</h1>
      </div>

      {/* Main content with sidebar and cards */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 overflow-y-auto sticky top-0">
          <CategoryNav onCategorySelect={(cat) => { setFilterCategory(cat); setCurrentPage(1); }} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-4 p-4 overflow-y-auto">
          <div className="grid grid-cols-4 gap-4">
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
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;