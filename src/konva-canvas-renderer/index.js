import React, { Fragment, memo } from "react";
import { Stage, Layer } from "react-konva";
import Row from "./Row";
const MAX_SEATS = 21;
const SEAT_LENGTH = 22;
const SRMC = true;
const MainStage = memo(
  (props) => {
    const seatData = props.data;

    let selectedSeats = [];
    const stageRef = React.useRef(null);

    const size = {
      width:
        seatData.length <= 50
          ? seatData.length * seatData[0].seats.length
          : (seatData.length / 2.2) * seatData[0].seats.length,
      height:
        seatData.length <= 50
          ? seatData.length * 22 + 200
          : (seatData.length / 1.25) * 22,
    };
    const calculateWidth = () => {
      if (!SRMC) {
        const lastR = seatData[seatData.length - 1];
        const l = lastR.seats.length;
        const coor = lastR.seats[l - 1].coordinates.x;
        return coor;
      } else return 0;
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
    const finalWidth = size.width + calculateWidth();
    console.log(calculateWidth());
    console.log("1");
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          backgroundColor: "white",
          position: "relative",
          width: "900px",
          margin: "auto",
          border: "1px solid",
        }}
      >
        <Stage
          ref={stageRef}
          width={size.width + calculateWidth()}
          height={size.height}
          scaleX={1}
          scaleY={1}
        >
          <Layer offsetY={-20} offsetX={100}>
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
