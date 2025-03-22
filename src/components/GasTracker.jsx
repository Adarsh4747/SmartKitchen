import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GasTracker = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(1);

  const handleAddData = (e) => {
    e.preventDefault();
    const dailyUsage = parseFloat(e.target.dailyUsage.value);
    if (!isNaN(dailyUsage)) {
      const monthlyUsage = dailyUsage * 30; // Approximate days in a month
      setData((prev) => [...prev, { month: `Month ${month}`, usage: monthlyUsage }]);
      setMonth((prev) => prev + 1);
      e.target.reset();
    }
  };

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Gas Consumption (Monthly)",
        data: data.map((item) => item.usage),
        borderColor: "rgb(70, 130, 180)",
        backgroundColor: "rgb(70, 130, 180)",
        fill: true,
        tension: 0.4
      },
    ],
  };

  return (
    <div>
      <h2>Gas Consumption Tracker</h2>
      <form onSubmit={handleAddData}>
        <input type="number" name="dailyUsage" placeholder="Enter daily gas usage (in units)" />
        <button type="submit">Add</button>
      </form>
      <Line data={chartData} />
    </div>
  );
};

export default GasTracker;
