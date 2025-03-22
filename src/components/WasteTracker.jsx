import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WasteTracker = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(1);

  const handleAddData = (e) => {
    e.preventDefault();
    const plastic = parseFloat(e.target.plastic.value) || 0;
    const bioWaste = parseFloat(e.target.bioWaste.value) || 0;
    const metal = parseFloat(e.target.metal.value) || 0;
    const paper = parseFloat(e.target.paper.value) || 0;

    const monthlyData = {
      month: `Month ${month}`,
      plastic: plastic * 30,
      bioWaste: bioWaste * 30,
      metal: metal * 30,
      paper: paper * 30,
    };

    setData((prev) => [...prev, monthlyData]);
    setMonth((prev) => prev + 1);
    e.target.reset();
  };

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      { label: "Plastic Waste (kg)", data: data.map((item) => item.plastic), backgroundColor: "rgb(255, 99, 71)" },
      { label: "Bio-Waste (kg)", data: data.map((item) => item.bioWaste), backgroundColor: "green" },
      { label: "Metal Waste (kg)", data: data.map((item) => item.metal), backgroundColor: "rgb(218, 165, 32)" },
      { label: "Paper Waste (kg)", data: data.map((item) => item.paper), backgroundColor: "rgb(240, 128, 128)" },
    ],
  };

  return (
    <div>
      <h2>Waste Tracker</h2>
      <form onSubmit={handleAddData}>
        <input type="number" name="plastic" placeholder="Plastic waste (kg)" />
        <input type="number" name="bioWaste" placeholder="Bio-waste (kg)" />
        <input type="number" name="metal" placeholder="Metal waste (kg)" />
        <input type="number" name="paper" placeholder="Paper waste (kg)" />
        <button type="submit">Add</button>
      </form>
      <Bar data={chartData} />
    </div>
  );
};

export default WasteTracker;
