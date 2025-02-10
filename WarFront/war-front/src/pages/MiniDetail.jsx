import React, {useState, useEffect} from "react";
import { useMiniContext } from "../contexts/MiniContext";
import { useParams } from "react-router-dom";
import { getMiniDetail } from "../services/api";
import {Line} from "react-chartjs-2";
import {
    Chart,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from "chart.js"

//Registering Chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

function MiniDetail(){
    const { miniId } = useParams();
    const [miniDetail, setMiniDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMiniDetail() {
            try {
                const data = await getMiniDetail(miniId);
                setMiniDetail(data);
            } catch (err) {
                console.error("Error fetching mini detail:", err);
                setError(err)
            } finally {
                setLoading(false);
            }
        }
        fetchMiniDetail();
    },[miniId])

  if(loading){
    return(
      <div className="h-screen flex items-center justify-center">
        <h1>Loading Mini data...</h1>
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

  const { mini, current_price, msrp, price_history } = miniDetail;
  // Prepare chart data using 'date_price' from each history record.
  const chartData = {
    labels: price_history.map((entry) => entry.date_price),
    datasets: [
      {
        label: "Price",
        data: price_history.map((entry) => entry.price),
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
        },
      },
    },
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{mini.name}</h1>
      <img
        src={mini.image_url}
        alt={mini.name}
        className="max-w-md mx-auto my-4"
      />
      <p className="mt-4">Current Price: ${current_price}</p>
      <p className="mt-2">MSRP: ${msrp}</p>
      <div className="mt-8" style={{ height: "300px" }}>
        <h2 className="text-xl font-semibold mb-2">Price History Graph</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default MiniDetail;