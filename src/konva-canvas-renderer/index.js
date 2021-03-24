import { select } from "d3-selection";
import React, { Fragment, memo, useEffect, useCallback } from "react";
import { Stage, Layer, Circle } from "react-konva";
import { transform } from "../canvas-renderer/transform";
import data from "./xlargeLayout";
import Row from "./Row";
import Seat from "./Seat";
const MAX_SEATS = 21;
const SEAT_LENGTH = 22;
const MainStage = memo(
  (props) => {
    const seatData = data;

    let selectedSeats = [];
    const containerRef = React.useRef(null);
    const stageRef = React.useRef(null);

    const size = {
      width: seatData.length * seatData[0].seats.length,
      height: seatData.length * 22 + 200,
    };

    const handleSelect = (name, pos) => {
      selectedSeats.push(name);
      props.setSeats(selectedSeats);
    };
    const handleDeselect = (name, pos) => {
      selectedSeats.splice(selectedSeats.indexOf(name), 1);
      props.setSeats(selectedSeats);
      //  setSelectedSeats(seats);
    };
    console.log("1");
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
        <Stage
          ref={stageRef}
          width={size.width + 1000}
          height={size.height + 1000}
        >
          <Layer offsetY={-20} offsetX={100}>
            {/* 
            Number of seats/2 * size of seat + (30 safe)
            <Fragment>
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
              {seatData.map((e, i) => {
                return (
                  <Row {...e} select={handleSelect} deselect={handleDeselect} />
                );
              })}
            </Fragment>
          </Layer>
        </Stage>
      </div>
    );
  },
  (a, b) => {
    return true;
  }
);

export default MainStage;
