import React from "react";
import GasTracker from "./components/GasTracker.jsx";
import WasteTracker from "./components/WasteTracker.jsx";
import GroceryTracker from "./components/GroceryTracker.jsx";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <h1>Household Tracker</h1>
      <GasTracker />
      <WasteTracker />
      <GroceryTracker />
    </div>
  );
};

export default App;
