import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GroceryTracker = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(1);

  const handleAddData = (e) => {
    e.preventDefault();
    const grocery1 = parseFloat(e.target.grocery1.value) || 0;
    const grocery2 = parseFloat(e.target.grocery2.value) || 0;

    const monthlyData = {
      month: `Month ${month}`,
      grocery1,
      grocery2,
    };

    setData((prev) => [...prev, monthlyData]);
    setMonth((prev) => prev + 1);
    e.target.reset();
  };

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      { label: "Grocery 1 (grams)", data: data.map((item) => item.grocery1), borderColor: "rgb(245, 255, 250)", tension: 0.4 },
      { label: "Grocery 2 (grams)", data: data.map((item) => item.grocery2), borderColor: "rgb(102, 205, 170)", tension: 0.4 },
    ],
  };

  return (
    <div>
      <h2>Grocery Tracker</h2>
      <form onSubmit={handleAddData}>
        <input type="number" name="grocery1" placeholder="Grocery 1 (grams)" />
        <input type="number" name="grocery2" placeholder="Grocery 2 (grams)" />
        <button type="submit">Add</button>
      </form>
      <Line data={chartData} />
    </div>
  );
};

export default GroceryTracker;
