import "./App.css";
import React, { useCallback } from "react";
import drawingJson from "../src/constants/drawingJson.json";
import { getIn } from "timm";
import SeatsCanvasRenderer from "./canvas-renderer/index";
import MainStage from "./konva-canvas-renderer";
import data from "./konva-canvas-renderer/xlargeLayout.js";
import { transform } from "./canvas-renderer/transform";

function App() {
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  let data = transform();
  const setSeats = useCallback((e) => {
    setSelectedSeats([...e]);
  }, []);

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
  console.log(selectedSeats);
  return (
    <div className="App">
      <div>{selectedSeats.join(",")}</div>

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
