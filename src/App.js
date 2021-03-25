import "./App.css";
import React, { useCallback, useState } from "react";
import MainStage from "./konva-canvas-renderer";
import { transform } from "./canvas-renderer/transform";
import curved from "./konva-canvas-renderer/curved";
import category from "./konva-canvas-renderer/category";
import xlargeLayout from "./konva-canvas-renderer/xlargeLayout.js";
import largeLayout from "./konva-canvas-renderer/largeLayout.js"
function App() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [data, setData] = React.useState(xlargeLayout);
  const setSeats = useCallback((e) => {
    setSelectedSeats([...e]);
  }, []);
  console.log(transform());
  // const handleSelect = (name) => {
  //   const seats = [...selectedSeats];
  //   seats.push(name);
  //   setSelectedSeats(seats);
  // };
  // const handleDeselect = (name) => {
  //   const seats = [...selectedSeats];
  //   seats.splice(seats.indexOf(name), 1);
  //   setSelectedSeats(seats);
  //   //  setSelectedSeats(seats);
  // };
  return (
    <div className="App">
      <div>Seats:{selectedSeats.join(",")}</div>
      <MainStage
        data={data}
        setSeats={setSeats}
        // select={handleSelect}
        // deselect={handleDeselect}
      />
    </div>
  );
}

export default App;
