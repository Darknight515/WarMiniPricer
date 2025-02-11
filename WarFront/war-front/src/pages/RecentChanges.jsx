import React, { useState, useEffect } from "react";
import { getRecentPriceChanges } from "../services/api";
import { Link } from "react-router-dom";
import DisplayCard from "../components/DisplayCard";

function RecentChanges() {
    const [recentMinis, setRecentMinis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchRecent() {
            try {
                const data = await getRecentPriceChanges();
                setRecentMinis(data.recent_minis);
            } catch (err) {
                console.error("Error fetching recent changes: ", err);
                setError(err);
            } finally {
                setLoading(false)
            }
        }
        fetchRecent();
    }, [])

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <h1>Loading Recent Price Changes...</h1>
            </div>
        )
    }
    if (error) {
        return (
            <div className="h-screen flex items-center justify-center">
                <h1>Error loading recent price changes</h1>
            </div>
        );
    }
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Recent Price Changes (Last 60 Days)</h1>
            <div className="grid grid-cols-4 gap-4">
                {recentMinis.map((mini) => (
                    <Link to={`/mini/${mini.id}`} key={mini.id}>
                        <DisplayCard mini={mini} />
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default RecentChanges