import React, {useState, useEffect} from "react"
import { getMiniDataList } from "../services/api"
import CategoryNav from "../components/CategoryNav";
import DisplayCard from "../components/DisplayCard";

function Home() {
    const [minis, setMinis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterCategory, setFilterCategory] = useState(null);

    useEffect(() => {
        async function fetchMinis() {
            try {
                const data = await getMiniDataList();
                // Expecting data in the format: {mini_data_list: [...]}
                setMinis(data.mini_data_list);
            } catch (error) {
                console.log('Error fetching mini data: ', error);
                setError(error);
            }finally{
                setLoading(false)
            }
        }
        fetchMinis();
    },[])

    if(loading){
        return(
            <div className="home">
                <h1>Loading Minis...</h1>
            </div>
        );
    }

    if(error){
        return(
            <div className="home">
                <h1>Error loading minis</h1>
            </div>
        )
    }

    // Filter minis by the selected category (if any)
    const filteredMinis = filterCategory
        ? minis.filter((mini) => mini.faction === filterCategory)
        : minis;

    return(
    <div className="h-screen flex flex-col">
      {/* Optional Home header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold">Mini Data List</h1>
      </div>
      {/* Main content with sidebar and cards */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-gray-100 p-4 overflow-y-auto sticky top-0">
          <CategoryNav onCategorySelect={setFilterCategory} />
        </aside>
        {/* Main Content */}
        <main className="flex-1 ml-4 p-4 overflow-y-auto">
          <ul className="space-y-4">
            {filteredMinis.map((mini) => (
                <DisplayCard mini={mini} key={mini.id}/>
            //   <li key={mini.id} className="p-4 bg-white shadow rounded">
            //     <strong>{mini.name}</strong> - {mini.faction}
            //   </li>
            ))}
          </ul>
        </main>
      </div>
    </div>
    )
}

export default Home