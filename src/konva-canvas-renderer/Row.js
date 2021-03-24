import React, { Fragment, useEffect } from "react";
import { Circle, Text } from "react-konva";
import Seat from "./Seat";

const Row = (props) => {
  const {
    row,
    seats,
    isCurved,
    centerPoint,
    select,
    deselect,
    selectedSeats,
  } = props;
  const [flag, setFlag] = React.useState(false);
  const [curveFactor, setCurveFactor] = React.useState(0);
  useEffect(() => {
    if (isCurved) {
      setCurveFactor((seats.length / 2) * 5);
    }
  }, [isCurved]);
  let firstSeat = { x: seats[0].coordinates.x, y: seats[0].coordinates.y };

  const currX = seats[0].coordinates.x - centerPoint.x + 200;
  const currY = seats[0].coordinates.y - centerPoint.y + 50;
  console.log(currX, currY);
  return (
    <Fragment>
      <Text x={currX} y={currY} text={`${row}`} />
      {seats.map((seat) => (
        <>
          <Seat
            {...seat}
            seats={seats.length}
            curveFactor={curveFactor}
            centerPoint={centerPoint}
            select={select}
            deselect={deselect}
            isSelected={selectedSeats.indexOf(seat.name) >= 0}
          />
        </>
      ))}
    </Fragment>
  );
};

export default Row;
