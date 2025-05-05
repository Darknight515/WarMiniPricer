import React, { useState, useEffect } from "react";
import { useMiniContext } from "../contexts/MiniContext";
import { useParams } from "react-router-dom";
import { getMiniDetail } from "../services/api";
import { Line } from "react-chartjs-2";
import { normalizeFaction } from "../utils/helper";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"
import OrderModal from "../components/OrderModal";

//Registering Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MiniDetail() {
  const { miniId } = useParams();
  const [miniDetail, setMiniDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(50);
  const [randomInventory, setRandomInventory] = useState(null);
  const [randomPreOrders, setRandomPreOrders] = useState(null);
  const [recommendedPrice, setRecommendedPrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');

  const handleOrderSubmit = (orderType, orderData) => {
    console.log("Order Submitted:", orderType, orderData);
    const quantity = parseInt(orderData?.quantity, 10) || 0;

    if (quantity > 0) {
      if (orderType === 'store') {
        // Store order increases inventory
        setRandomInventory(prevInventory => (prevInventory !== null ? prevInventory + quantity : quantity));
        // Optionally, you could decrease pre-orders if this fulfills them, but based on current setup, just increasing inventory seems right.
      } else if (orderType === 'delivery') {
        // Delivery order decreases inventory
        setRandomInventory(prevInventory => (prevInventory !== null ? Math.max(0, prevInventory - quantity) : 0)); // Ensure inventory doesn't go below 0
      }
      // For 'supplier' type, you might trigger an API call or other logic instead of changing local state directly.
    }
    // Add logic here to potentially send the orderData to an API endpoint
  };

  const openOrderModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    async function fetchMiniDetail() {
      try {
        const data = await getMiniDetail(miniId);
        setMiniDetail(data);

        //Generate random numbers for second card entry.
        setRandomInventory(getRandomInt(min, max));
        setRandomPreOrders(getRandomInt(min, max));
        if (data?.msrp) {
          const markUpPercentage = Math.random() * 0.2 + 0.2;
          const calculatedPrice = data.msrp * (1 + markUpPercentage);
          console.log(`calculated price: ${calculatedPrice}`)

          setRecommendedPrice(calculatedPrice.toFixed(2));
        }
      } catch (err) {
        console.error("Error fetching mini detail:", err);
        setError(err)
      } finally {
        setLoading(false);
      }
    }
    fetchMiniDetail();
  }, [miniId, min, max])

  const getRandomInt = (min, max) => {
    min = Math.min(min, max);
    max = Math.max(min, max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

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
          maxRotation: 45, // Rotate labels for better fit
          minRotation: 45,
          callback: function (value, index, values) {
            // Format the date to be more compact
            const date = new Date(this.getLabelForValue(value));
            return date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
          }
        }
      },
      y: {
        title: {
          display: true,
          text: "Price",
          color: "var(--color-off-white)",
        },
        ticks: {
          color: "var(--color-off-white)",
          callback: function (value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "var(--color-off-white)",
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'var(--color-off-white)',
        padding: 10,
        callbacks: {
          title: function (tooltipItems) {
            const date = new Date(tooltipItems[0].label);
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          },
          label: function (context) {
            const price = Number(context.raw);
            return `Price: $${isNaN(price) ? '0.00' : price.toFixed(2)}`;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
        backgroundColor: "var(--color-imperial-gold)",
        borderColor: "var(--color-off-white)",
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    }
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

      {/* Test column area */}
      <div className="grid grid-cols-2 gap-8 mt-8">

        {/* Mini Details Card - Left Column */}
        <div className="bg-[var(--color-dark-grey)] rounded-lg shadow-lg overflow-hidden]">
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-[var(--color-imperial-gold)]">
            <h3 className="text-xl font-semibold text-[var(--color-off-white)]">Mini Details:</h3>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <dl className="grid gap-4">
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">Name:</dt>
                <dd className="text-[var(--color-off-white)] col-span-2">{mini.name}</dd>
              </div>
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">Faction:</dt>
                <dd className="text-[var(--color-off-white)] col-span-2">{normalizeFaction(mini.faction)}</dd>
              </div>
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">MSRP Price:</dt>
                <dd className="text-[var(--color-off-white)] col-span-2">${msrp}</dd>
              </div>
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">Current Price:</dt>
                <dd className="text-[var(--color-off-white)] col-span-2">${current_price}</dd>
              </div>
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">Discount:</dt>
                <dd className="text-[var(--color-off-white)] col-span-2">{percentage}% (${(msrp - current_price).toFixed(2)})</dd>
              </div>
            </dl>
          </div>
          <hr />
          <div>
          </div>
        </div>

        {/* Right column - Placeholder */}
        <div className="bg-[var(--color-dark-grey)] rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-imperial-gold)]">
            <h3 className="text-xl font-semibold text-[var(--color-off-white)]">Store Inventory & Operations</h3>
          </div>
          <div className="p-6">
            <dl className="grid gap-4">
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">Store Inventory:</dt>
                <dd className="text-[var(--color-off-white)] col-span-2">{randomInventory !== null ? randomInventory : 'Searching Database...'}</dd>
              </div>
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">Pending Pre-Orders:</dt>
                <dd className="text-[var(--color-off-white)] col-span-2">{randomPreOrders !== null ? randomPreOrders : 'Searching Database...'}</dd>
              </div>
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">Recommended Price:</dt>
                <dd className="text-[var(--color-off-white)] col-span-2">{recommendedPrice ? `$${recommendedPrice}` : '--'}</dd>
              </div>
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">Profit Margin:</dt>
                <dd className="text-[var(--color-off-white)] col-span-2">${(recommendedPrice - current_price).toFixed(2)}</dd>
              </div>
              <div className="grid grid-cols-3 items-center">
                <dt className="text-[var(--color-off-white)] font-medium">Actions:</dt>
                <dd className="col-span-2">
                  <div className="flex space-x-4">
                    {/* Button 1: Example 'Edit' */}
                    <button
                      onClick={() => openOrderModal('store')} 
                      className="px-3 py-1 bg-[var(--color-imperial-gold)] text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                      Store Order
                    </button>
                    {/* Button 2: Example 'Delete' */}
                    <button
                      onClick={() => openOrderModal('delivery')}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                     Delivery Order
                    </button>
                    {/* Button 3: Example 'View' */}
                    <button
                      onClick={() => openOrderModal('supplier')} // Replace with your actual handler, e.g., handleView()
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    >
                      Contact SP
                    </button>
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      {/* END Test column ares */}

      {/* Mini Details Card */}
    <OrderModal 
      isOpen={isModalOpen} 
      onClose={() => setIsModalOpen(false)} 
      type={modalType} 
      miniDetail={miniDetail}
      onOrderSubmit={handleOrderSubmit}
    />
    </div>

  )
}

export default MiniDetail;