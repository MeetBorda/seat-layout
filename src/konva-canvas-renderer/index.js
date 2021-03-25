import React, { Fragment, memo } from "react";
import { Stage, Layer } from "react-konva";
import Row from "./Row";
import logo from "./loader.gif";
const MAX_SEATS = 21;
const SEAT_LENGTH = 22;
const SRMC = true;
const xL = true;
const MainStage = memo(
  (props) => {
    const seatData = props.data;
    let selectedSeats = [];
    const stageRef = React.useRef(null);

    if (seatData.length === 0) {
      return (
        <div>
          <img src={logo} />
        </div>
      );
    }

    // const size = {
    //   width:
    //     seatData.length <= 50
    //       ? seatData.length * seatData[0].seats.length * 10
    //       : (seatData.length / 2.2) * seatData[0].seats.length,
    //   height:
    //     seatData.length <= 50
    //       ? seatData.length * 22 + 400
    //       : (seatData.length / 1.25) * 22,
    // };
    const size = {
      width: seatData.length * seatData[0].seats.length * 22,
      height: seatData.length * 22 + 200,
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
    console.log(finalWidth);
    console.log("once");

    // React.useEffect(() => {
    //   if (!stageRef.current) {
    //     return;
    //   }
    //   if (seatData.length <= 50) {
    //     return;
    //   }
    //   const stage = stageRef.current;
    //   const clientRect = stage.getClientRect({ skipTransform: true });
    //   const fact = seatData.length <= 50 ? 1 : 2;
    //   const scaleToFit = size.width / clientRect.width / fact;
    //   setVirtualWidth(clientRect.width);
    //   setScale(scaleToFit);
    // }, [size]);
    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          backgroundColor: "white",
          position: "relative",
          width: "max-content",
          margin: "auto",
          border: "1px solid",
        }}
      >
        <Stage
          ref={stageRef}
          width={3000}
          height={size.height + 500}
          // width={xL ? 3000 : size.width}
          // height={xL ? 3000 : size.height * 2}
          scaleX={1}
          scaleY={1}
        >
          <Layer offsetY={0} offsetX={100}>
            <Fragment>
              {seatData.map((e, i) => {
                return (
                  <Row
                    {...e}
                    i={i}
                    select={handleSelect}
                    deselect={handleDeselect}
                  />
                );
              })}
            </Fragment>
          </Layer>
        </Stage>
      </div>
    );
  },
  (a, b) => {
    return a.data === b.data;
  }
);

export default MainStage;
