import { select } from "d3-selection";
import React, { Fragment, useEffect } from "react";
import { Stage, Layer, Circle } from "react-konva";
import { transform } from "../canvas-renderer/transform";
import Row from "./Row";
import Seat from "./Seat";
const MAX_SEATS = 21;
const MainStage = (props) => {
  const seatData = transform();
  const withRow = [];

  withRow.push({
    seats: seatData.seats,
    row: "A",
    centerPoint: seatData.centerPoint,
  });
  const [seats, setSeats] = React.useState(withRow);
  console.log(seatData);
  const [color, setColor] = React.useState("red");
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  const containerRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const rows = [
    {
      row: "A",
      seats: [
        {
          name: "A-1",
          coordinates: {
            x: 633,
            y: 302.5,
          },
          number: 1,
          prefix: "A",
        },
        {
          name: "A-2",
          coordinates: {
            x: 660,
            y: 302.5,
          },
          number: 2,
          prefix: "A",
        },
      ],
      centerPoint: {
        x: 633,
        y: 302.5,
        lock: false,
      },
    },
    {
      row: "B",
      seats: [
        {
          name: "B-1",
          coordinates: {
            x: 633,
            y: 352.5,
          },
          number: 1,
          prefix: "A",
        },
        {
          name: "B-2",
          coordinates: {
            x: 660,
            y: 352.5,
          },
          number: 2,
          prefix: "B",
        },
      ],
      centerPoint: {
        x: 633,
        y: 352.5,
        lock: false,
      },
    },
    {
      row: "C",
      isCurved: true,
      seats: [
        {
          name: "C-1",
          coordinates: {
            x: 633,
            y: 390,
          },
          number: 1,
          prefix: "C",
        },
        {
          name: "C-2",
          coordinates: {
            x: 655,
            y: 382.5,
          },
          number: 2,
          prefix: "C",
        },
        {
          name: "C-3",
          coordinates: {
            x: 677,
            y: 374.5,
          },
          number: 3,
          prefix: "C",
        },
      ],
      centerPoint: {
        x: 633,
        y: 382.5,
        lock: false,
      },
    },
  ];
  let mx = 677;
  let my = 374.5;
  for (let i = 0; i < 7; i++) {
    mx = mx + 22;
    my = my - 8;
    rows[2].seats.push({
      name: `C-${4 + i}`,
      coordinates: {
        x: mx,
        y: my,
      },
      number: 4 + i,
      prefix: "C",
    });
  }
  for (let i = 0; i < 10; i++) {
    mx = mx + 22;
    my = my + 6.5;
    rows[2].seats.push({
      name: `C-${11 + i}`,
      coordinates: {
        x: mx,
        y: my,
      },
      number: 11 + i,
      prefix: "C",
    });
  }
  // Calculate ROW HEIGHT initially based on number of seats and curve factor
  const size = { width: MAX_SEATS * 25 + 25, height: 500 };

  const onHoverSeat = () => {
    setColor("blue");
  };
  const handleSelect = (name, pos) => {
    const seats = selectedSeats.concat([name]);
    setSelectedSeats(seats);
  };
  const handleDeselect = (name, pos) => {
    const seats = selectedSeats.slice();
    seats.splice(seats.indexOf(name), 1);
    setSelectedSeats(seats);
  };
  console.log(selectedSeats);
  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        backgroundColor: "lightgrey",
        position: "relative",
        width: "max-content",
        margin: "auto",
      }}
      ref={containerRef}
    >
      <Stage ref={stageRef} width={size.width} height={size.height}>
        <Layer offsetY="-30" offsetX="-50">
          {/* <Fragment>
            {seats.map((e) => {
              return (
                <Seat
                  {...e}
                  centerPoint={seatData.centerPoint}
                  select={handleSelect}
                  deselect={handleDeselect}
                  isSelected={selectedSeats.indexOf(e.name) >= 0}
                />
              );
            })}
        </Fragment>
        SEAT RENDERING
        */}
          <Fragment>
            {seatData.map((e) => {
              return (
                <Row
                  {...e}
                  centerPoint={seatData[0].centerPoint}
                  select={handleSelect}
                  deselect={handleDeselect}
                  isSelected={selectedSeats.indexOf(e.name) >= 0}
                  selectedSeats={selectedSeats}
                />
              );
            })}
          </Fragment>
        </Layer>
      </Stage>
    </div>
  );
};

export default MainStage;
