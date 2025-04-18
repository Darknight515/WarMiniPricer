import React, { useState, useEffect } from "react";
import { useMiniContext } from "../contexts/MiniContext";
import { useParams } from "react-router-dom";
import { getMiniDetail } from "../services/api";
import { Line } from "react-chartjs-2";
import { normalizeFaction } from "../utils/helper";
import {
  Chart,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js"

//Registering Chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, PointElement);

function MiniDetail() {
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
  }, [miniId])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--color-dark-grey)] text-[var(--color-off-white)]">
        <h1>Loading Mini data...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--color-dark-grey)] text-[var(--color-off-white)]">
        <h1>Error loading minis</h1>
      </div>
    );
  }

  const { mini, current_price, msrp, price_history } = miniDetail;
  const percentage = (((miniDetail.msrp - miniDetail.current_price) / miniDetail.msrp) * 100).toFixed(2);

  // Prepare chart data using your theme colors
  const chartData = {
    labels: price_history.map((entry) => entry.date_price),
    datasets: [
      {
        label: "Price",
        data: price_history.map((entry) => entry.price),
        fill: false,
        backgroundColor: "#C9A227", // Imperial Gold
        borderColor: "rgba(201, 162, 39, 0.7)", // Imperial Gold with opacity
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
          color: "var(--color-off-white)",
        },
        ticks: {
          color: "var(--color-off-white)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Price",
          color: "var(--color-off-white)",
        },
        ticks: {
          color: "var(--color-off-white)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "var(--color-off-white)",
        },
      },
    },
  };


  return (
    <div className="p-4  text-[var(--color-off-white)] min-h-screen overflow-y-auto overflow-x-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left Column: Mini Image and Details */}
        <div className="md:w-1/2 flex flex-col items-center">
          <h1 className="text-2xl font-bold">{mini.name}</h1>
          <img
            src={mini.image_url}
            alt={mini.name}
            className="max-w-md mx-auto my-4 rounded"
          />
          <p className="mt-4">Current Price: ${current_price}</p>
          <p className="mt-2">MSRP: ${msrp}</p>
        </div>
        {/* Right Column: Price History Graph */}
        <div className="md:w-1/2 flex flex-col mt-8 md:mt-0 md:ml-4 mr-8">
          <h2 className="text-xl font-semibold mb-2">Price History Graph</h2>
          <div className="w-full" style={{ height: "300px", backgroundColor: "var(--color-off-white)" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <hr />
      {/* Row After image & charts */}
      <div>
        {/* Mini Details */}
        <div className="text-black">
          <ul>
          <li>Name: {mini.name}</li>
          <li>Faction: {normalizeFaction(mini.faction)}</li>
          <li>MSRP Price: ${msrp}</li>
          <li>Current Price: ${current_price}</li>
          <li>Discount: {percentage}% (${(msrp - current_price).toFixed(2)})</li>
          </ul>
        </div>
        {/* Description */}
        <hr />
        <div>
          <p className="text-black">{JSON.stringify(mini)}</p>
        </div>
      </div>
    </div>
  )
}

export default MiniDetail;