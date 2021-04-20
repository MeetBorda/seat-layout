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
import icon from "./konva-canvas-renderer/constants/icon.js";
import manyIcons from "./konva-canvas-renderer/constants/manyIcons";
import newJson from "./konva-canvas-renderer/constants/newJson";
import master from "./konva-canvas-renderer/constants/master";
import palm from "./konva-canvas-renderer/constants/palm";
function App() {
  const [selectedSeats, setSelectedSeats] = useState({});
  const [data, setData] = useState(palm);

  const makeData = transform();
  console.log(makeData);
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
    } else if (window.location.pathname === "/k") {
      setData(icon);
    } else if (window.location.pathname === "/new") {
      setData(newJson);
    } else if (window.location.pathname === "/master") {
      setData(master);
    } else {
      setData(palm);
    }
  }, []);

  const handleSeatSelect = (seat) => {
    if (seat) {
      const seatKey = `${seat.name}-${seat.coordinates.x}-${seat.coordinates.y}`;
      setSelectedSeats((p) => {
        const pClone = { ...p };
        if (pClone[seatKey]) {
          delete pClone[seatKey];
        } else {
          pClone[seatKey] = seat;
        }
        return pClone;
      });
    }
  };

  const selectedSeatsArr = Object.values(selectedSeats).map((s) => s.name);

  return (
    <div className="App">
      <div>1222</div>
      <div>Seats:{selectedSeatsArr.join(",")}</div>
      <MainStage
        data={data}
        setSeats={handleSeatSelect}
        selectedSeats={selectedSeats}
      />
    </div>
  );
}

export default App;
