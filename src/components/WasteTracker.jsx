import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const WasteTracker = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(1);
  const [error, setError] = useState("");
  const collectionRef = collection(db, "wasteData");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        const fetchedData = querySnapshot.docs.map((doc) => ({
          month: doc.data().month,
          plastic: doc.data().plastic,
          bioWaste: doc.data().bioWaste,
          metal: doc.data().metal,
          paper: doc.data().paper,
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
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collectionRef, monthlyData);
      setData((prev) => [...prev, monthlyData]);
      setMonth((prev) => prev + 1);
      setError("");
    } catch (error) {
      console.error("Error adding document: ", error);
      setError("Failed to save data. Please try again.");
    }

    e.target.reset();
  };

  const chartData = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Plastic Waste (kg)",
        data: data.map((item) => item.plastic),
        backgroundColor: "rgb(255, 99, 71)",
      },
      {
        label: "Bio-Waste (kg)",
        data: data.map((item) => item.bioWaste),
        backgroundColor: "green",
      },
      {
        label: "Metal Waste (kg)",
        data: data.map((item) => item.metal),
        backgroundColor: "rgb(218, 165, 32)",
      },
      {
        label: "Paper Waste (kg)",
        data: data.map((item) => item.paper),
        backgroundColor: "rgb(240, 128, 128)",
      },
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
      {error && <p className="error-message">{error}</p>}
      <Bar data={chartData} />
    </div>
  );
};

export default WasteTracker;
