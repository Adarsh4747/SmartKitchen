import React, { useState, useEffect } from "react";
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
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GroceryTracker = () => {
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(1);
  const [error, setError] = useState("");
  const collectionRef = collection(db, "groceryData");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collectionRef);
        const fetchedData = querySnapshot.docs.map((doc) => ({
          month: doc.data().month,
          grocery1: doc.data().grocery1,
          grocery2: doc.data().grocery2,
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
    const grocery1 = parseFloat(e.target.grocery1.value) || 0;
    const grocery2 = parseFloat(e.target.grocery2.value) || 0;

    const monthlyData = {
      month: `Month ${month}`,
      grocery1,
      grocery2,
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
        label: "Grocery 1 (grams)",
        data: data.map((item) => item.grocery1),
        borderColor: "rgb(245, 255, 250)",
        tension: 0.4,
      },
      {
        label: "Grocery 2 (grams)",
        data: data.map((item) => item.grocery2),
        borderColor: "rgb(102, 205, 170)",
        tension: 0.4,
      },
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
      {error && <p className="error-message">{error}</p>}
      <Line data={chartData} />
    </div>
  );
};

export default GroceryTracker;
