import React, {useState, useEffect} from "react"
import { getMiniDataList } from "../services/api"

function Home() {
    const [minis, setMinis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    return(
        <div className="home">
            <h1>Mini Data List</h1>
            <ul>
                {
                    minis.map((mini) =>(
                        <li key={mini.id}>
                            <strong>{mini.name}</strong> - {mini.faction}
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Home