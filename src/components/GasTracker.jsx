import React, { useState, useMemo, useEffect } from "react";
import { app, db } from "../firebase/config";
import {
  doc,
  setDoc,
  collection,
  serverTimestamp,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GasTracker = () => {
  const [data, setData] = useState([]);
  const [dailyUsage, setDailyUsage] = useState("");
  const [error, setError] = useState("");
  const collectionRef = collection(db, "gasData");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        const fetchedData = querySnapshot.docs.map((doc) => ({
          month: doc.data().month,
          usage: doc.data().usage,
        }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
        setError("Failed to load data. Please try again.");
      }
    };

    fetchData();
  }, [collectionRef]);

  const handleAddData = async (e) => {
    e.preventDefault();
    const usage = parseFloat(dailyUsage);

    if (isNaN(usage)) {
      setError("Please enter a valid number");
      return;
    }

    if (usage < 0) {
      setError("Usage cannot be negative");
      return;
    }

    const monthlyUsage = usage * 30; // Approximate days in a month
    const newMonth = data.length + 1;

    try {
      await addDoc(collectionRef, {
        month: `month_${newMonth}`,
        usage: monthlyUsage,
        timestamp: serverTimestamp(),
      });
      console.log("Document written with ID: ", `month_${newMonth}`);
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Failed to save data. Please try again.");
      return;
    }

    setData((prev) => [
      ...prev,
      { month: `Month ${newMonth}`, usage: monthlyUsage },
    ]);
    setDailyUsage("");
    setError("");
  };

  // Use useMemo to prevent unnecessary recalculations
  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.month),
      datasets: [
        {
          label: "Gas Consumption (Monthly)",
          data: data.map((item) => item.usage),
          borderColor: "rgb(70, 130, 180)",
          backgroundColor: "rgba(70, 130, 180, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    }),
    [data]
  );

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Gas Units",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `Monthly usage: ${context.raw.toFixed(2)} units`,
        },
      },
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Gas Consumption",
      },
    },
  };

  return (
    <div className="gas-tracker">
      <h2>Gas Consumption Tracker</h2>

      <form onSubmit={handleAddData}>
        <div className="form-group">
          <label htmlFor="dailyUsage">Daily Gas Usage (units)</label>
          <input
            type="number"
            id="dailyUsage"
            value={dailyUsage}
            onChange={(e) => setDailyUsage(e.target.value)}
            placeholder="Enter daily gas usage"
            step="0.01"
          />
          <button type="submit">Add Data</button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>

      <div className="stats-summary">
        {data.length > 0 && (
          <div>
            <p>Total Months: {data.length}</p>
            <p>
              Average Monthly Usage:{" "}
              {(
                data.reduce((acc, item) => acc + item.usage, 0) / data.length
              ).toFixed(2)}{" "}
              units
            </p>
          </div>
        )}
      </div>

      <div
        className="chart-container"
        style={{ height: "400px", marginTop: "20px" }}
      >
        {data.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <p className="no-data-message">
            No data yet. Add your daily gas usage to see consumption trends.
          </p>
        )}
      </div>
    </div>
  );
};

export default GasTracker;
