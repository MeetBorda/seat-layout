import "./App.css";
import React, { useCallback, useState } from "react";
import MainStage from "./konva-canvas-renderer";
import { transform } from "./canvas-renderer/transform";
import curved from "./konva-canvas-renderer/constants/curved";
import random from "./konva-canvas-renderer/constants/random";
import category from "./konva-canvas-renderer/constants/category";
import l from "./konva-canvas-renderer/constants/l.js";
import xl from "./konva-canvas-renderer/constants/xl.js";
import xxl from "./konva-canvas-renderer/constants/xxl.js";
import xxxl from "./konva-canvas-renderer/constants/xxxl.js";

function App() {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [data, setData] = React.useState([]);
  const setSeats = useCallback((e) => {
    setSelectedSeats([...e]);
  }, []);
  const newData = transform();
  React.useEffect(() => {
    if (window.location.pathname === "/curved") {
      setData(curved);
    } else if (window.location.pathname === "/category") {
      setData(category);
    } else if (window.location.pathname === "/xl") {
      setData(xl);
    } else if (window.location.pathname === "/l") {
      setData(l);
    } else if (window.location.pathname === "/xxxl") {
      setData(xxxl);
    } else if (window.location.pathname === "/xxl") {
      setData(xxl);
    } else if (window.location.pathname === "/random") {
      setData(random);
    } else {
      setData(newData);
    }
  }, []);

  //console.log(transform());
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
  const totalSeats = () => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      let one = data[i].seats.length;
      total += one;
    }
    return total;
  };
  return (
    <div className="App">
      <div>{totalSeats()}</div>
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
